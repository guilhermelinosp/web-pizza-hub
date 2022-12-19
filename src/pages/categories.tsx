import React from 'react'
import Head from 'next/head'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Input } from '../components/Input'
import styles from '../styles/categories.module.scss'
import { SSRAuth } from '../utils/SSR/SSRAuth'
import { api, setupAPIClient } from '../services/api'
import { toast } from 'react-toastify'
import { AiOutlineDelete } from 'react-icons/ai'

type CategoryProps = {
	id: string
	name: string
}

interface HomeProps {
	categories: CategoryProps[]
}

export default function Categories({ categories }: HomeProps) {
	const [name, setName] = React.useState('')
	const [categoriesList, setCategoriesList] = React.useState(categories || [])

	const handleCreateCategory = async (event: React.FormEvent) => {
		event.preventDefault()

		if (name === '') {
			toast.warning('Nome é obrigatório')
			return
		}

		try {
			await api.post('/categories', {
				name
			})
			toast.success('Categoria criada com sucesso')
			setName('')
			handleRefreshCategories()
		} catch (err) {
			toast.error('Categoria já existe')
			setName('')
		}
	}

	const handleDeleteCategory = async (id: string) => {
		try {
			await api.delete(`/categories/${id}`)
			toast.success('Categoria deletada com sucesso')

			handleRefreshCategories()
		} catch (err) {
			toast.error('Categoria não pode ser deletada, pois está em uso')
		}
	}

	const handleRefreshCategories = async () => {
		const { data } = await api.get('/categories')
		setCategoriesList(data)
	}

	return (
		<>
			<Head>
				<title>Categorias | Pizza Hub</title>
			</Head>
			<Header />
			<main className={styles.container}>
				<div className={styles.content}>
					<div className={styles.header}>
						<h1>Criar nova categoria</h1>
					</div>

					<form onSubmit={handleCreateCategory} className={styles.form}>
						<Input
							placeholder="Nome"
							type="text"
							autoCapitalize="none"
							value={name}
							onChange={name => setName(name.target.value)}
						/>

						<Button type="submit">Criar</Button>
					</form>

					<div className={styles.header}>
						<h1>Lista de Categorias</h1>
					</div>

					<article className={styles.categories}>
						{categoriesList.map(category => {
							return (
								<section key={category.id} className={styles.items}>
									<div className={styles.tag}></div>

									<div className={styles.name}>
										<span>{category.name}</span>
										<div className={styles.delete}>
											<button
												className={styles.delete}
												onClick={() => handleDeleteCategory(category.id)}
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

export const getServerSideProps = SSRAuth(async ctx => {
	const api = setupAPIClient(ctx as any)

	const { data } = await api.get('/categories')

	return {
		props: {
			categories: data
		}
	}
})
