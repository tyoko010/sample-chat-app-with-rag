import os
from typing import List

from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings

from langchain_chroma import Chroma

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import PromptTemplate
from langchain.schema import Document


class OpenAIEngine:
    STORE_PATH = "./chromadb"

    PROMPT_TEMPLATE = """\
    あなたは有能なアシスタントです。
    以下のコンテキストを参考に、ユーザーの質問に回答してください。

    コンテキスト:
    {context}

    質問: {question}

    回答を日本語で、箇条書きなど読みやすい形式にしてください。
    """

    def __init__(self, openai_api_key, store_path = STORE_PATH):
        self._models = {
            'gpt-4o',
            'gpt-4o-mini',
            'o1-mini',
        }

        self.openai_api_key = openai_api_key

        self.vectorstore = Chroma(
            collection_name="default_collection",
            persist_directory=store_path,
            embedding_function= OpenAIEmbeddings(
                api_key=self.openai_api_key
            )
        )

    def add_page(self, content, source):
        doc = Document(
            page_content=content,
            metadata={"source": source}
        )
        self.vectorstore.add_documents([doc])

    def answer(self, question):
        context, source_links = self._get_context_and_links(question)
        qa_chain = self._get_qa_chain()
        answer = qa_chain.invoke({"context": context, "question": question})
        return answer, source_links

    def _get_context_and_links(self, question):
        retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
        docs: List[Document] = retriever.invoke(question)

        context_texts = []
        source_links = []

        for doc in docs:
            context_texts.append(doc.page_content.strip())
            if "source" in doc.metadata:
                source_links.append(doc.metadata["source"])

        merged_context = "\n\n".join(context_texts)
        # TODO: cut the context at the token upper limit

        return merged_context, source_links
    
    def _get_qa_chain(self, model_name="gpt-4o-mini"):
        if model_name not in self._models:
            raise ValueError(f"Model {model_name} not supported")

        prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=OpenAIEngine.PROMPT_TEMPLATE
        )
        llm = ChatOpenAI(
            model=model_name,
            openai_api_key=self.openai_api_key
        )
        qa_chain = prompt | llm | StrOutputParser()
        return qa_chain

    def _chat_chain(self, model_name="gpt-4o-mini"):
        if model_name not in self._models:
            raise ValueError(f"Model {model_name} not supported")

        llm = ChatOpenAI(
            model=model_name,
            openai_api_key=self.openai_api_key
        )
        return llm | StrOutputParser()

    def chat(self, prompt, model_name="gpt-4o-mini"):
        if model_name not in self._models:
            raise ValueError(f"Model {model_name} not supported")

        llm = ChatOpenAI(
            model=model_name,
            openai_api_key=self.openai_api_key
        )
        chain = llm | StrOutputParser()

        return chain.invoke(prompt)
