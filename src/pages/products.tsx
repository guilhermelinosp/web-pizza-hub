import React from 'react'
import Head from 'next/head'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import styles from '../styles/products.module.scss'
import { SSRAuth } from '../utils/SSR/SSRAuth'
import { api, setupAPIClient } from '../services/api'
import { toast } from 'react-toastify'
import { AiOutlineDelete } from 'react-icons/ai'

type ProductsProps = {
	id: string
	name: string
}

interface ProductsHomeProps {
	products: ProductsProps[]
	categories: ProductsProps[]
}

export default function Products({ products, categories }: ProductsHomeProps) {
	const [productsList, setProductsList] = React.useState(products || [])
	const [name, setName] = React.useState('')
	const [price, setPrice] = React.useState('')
	const [categoriesList, setCategoriesList] = React.useState(categories || [])
	const [selectedCategory, setSelectedCategory] = React.useState(0)

	const handleCreateProduct = async (event: React.FormEvent) => {
		event.preventDefault()

		if (name === '' || price === '') {
			toast.warning('Nome e preço são obrigatórios')
			return
		}

		try {
			await api.post('/products', {
				name,
				price,
				category_id: categoriesList[selectedCategory].id
			})

			toast.success('Produto criado com sucesso')
			handleRefreshProducts()
			handleRefreshCategories()

			setName('')
			setPrice('')
		} catch (err) {
			toast.error('Erro ao criar produto')
		}
	}

	const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(Number(event.target.value))
	}

	const handleRefreshProducts = async () => {
		const { data } = await api.get('/products')
		setProductsList(data)
	}

	const handleRefreshCategories = async () => {
		const { data } = await api.get('/categories')
		setCategoriesList(data)
	}

	const handleDeleteProducts = async (id: string) => {
		try {
			await api.delete(`/products/${id}`)
			toast.success('Produto deletado com sucesso')

			handleRefreshProducts()
			handleRefreshCategories()
		} catch (err) {
			toast.error('Produto não pode ser deletado, pois está em uso')
		}
	}

	return (
		<>
			<Head>
				<title>Produtos | Pizza Hub</title>
			</Head>
			<Header />
			<main className={styles.container}>
				<div className={styles.header}>
					<h1>Criar novo Produto</h1>
				</div>

				<div className={styles.content}>
					<form className={styles.form} onSubmit={handleCreateProduct}>
						<select value={selectedCategory} onChange={handleCategoryChange}>
							{categories.map((category, index) => (
								<option key={category.id} value={index}>
									{category.name}
								</option>
							))}
						</select>

						<Input
							placeholder="Nome"
							type="text"
							autoCapitalize="none"
							value={name}
							onChange={(name) => setName(name.target.value)}
						/>

						<Input
							placeholder="Preço"
							type="number"
							autoCapitalize="none"
							value={price}
							onChange={(price) => setPrice(price.target.value)}
						/>

						<Button type="submit">Criar</Button>
					</form>

					<div className={styles.header}>
						<h1>Lista de Produtos</h1>
					</div>

					<article className={styles.products}>
						{productsList.map((product) => {
							return (
								<section key={product.id} className={styles.items}>
									<div className={styles.tag}></div>
									<div className={styles.name}>
										<span>{product.name}</span>
										<div className={styles.delete}>
											<button
												className={styles.delete}
												onClick={() => handleDeleteProducts(product.id)}
											>
												<AiOutlineDelete size={24} color="#f00" />
											</button>
										</div>
									</div>
								</section>
							)
						})}
					</article>
				</div>
			</main>
		</>
	)
}

export const getServerSideProps = SSRAuth(async (ctx) => {
	const api = setupAPIClient(ctx as any)

	const resProd = await api.get('/products')
	const resCate = await api.get('/categories')

	return {
		props: {
			products: resProd.data,
			categories: resCate.data
		}
	}
})
