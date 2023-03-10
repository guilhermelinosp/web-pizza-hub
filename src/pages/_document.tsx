import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {
	static async getInitialProps(context: DocumentContext) {
		const initialProps = await Document.getInitialProps(context)
		return { ...initialProps }
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.gstatic.com" />
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
						rel="stylesheet"
					/>
					<link rel="shortcut icon" href="/favicon.png" type="image/png" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
