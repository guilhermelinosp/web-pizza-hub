/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import Head from 'next/head'
import styles from '../styles/dashboard.module.scss'
import Modal from 'react-modal'
import { SSRAuth } from '../utils/SSR/SSRAuth'
import { ModalOrder } from '../components/ModalOrder'
import { setupAPIClient, api } from '../services/api'
import { Header } from '../components/Header'

type OrderProps = {
	id: string
	table: string | number
	status: boolean
	draft: boolean
}

interface HomeProps {
	ordersProgress: OrderProps[]
	ordersFinalized: OrderProps[]
}

export type OrderItemProps = {
	id: string
	amount: number
	order_id: string
	product_id: string

	product: {
		id: string
		name: string
		price: string
		category_id: string
	}

	order: {
		id: string
		table: string | number
		status: boolean
		draft: boolean
	}
}

export default function Dashboard({ ordersProgress, ordersFinalized }: HomeProps) {
	const [ordersFinalizedList, setOrdersFinalizedList] = React.useState(ordersFinalized || [])
	const [ordersProgressList, setOrdersProgressList] = React.useState(ordersProgress || [])
	const [modalItem, setModalItem] = React.useState<OrderItemProps[]>()
	const [modalVisible, setModalVisible] = React.useState(false)

	React.useEffect(() => {
		Modal.setAppElement('body')

		setTimeout(() => {
			handleRefreshOrders()
		}, 1000)
	}, [handleRefreshOrders])

	async function handleOpenModalView(id: string) {
		const { data } = await api.get(`/items/readbyorder`, {
			params: {
				order_id: id
			}
		})

		handleRefreshOrders()
		setModalItem(data)
		setModalVisible(true)
	}

	function handleCloseModal() {
		setModalVisible(false)
		handleRefreshOrders()
	}

	async function handleFinishItem(id: string) {
		await api.put(`/orders/finish/${id}`)

		handleRefreshOrders()
		setModalVisible(false)
	}

	async function handleRefreshOrders() {
		const resProgress = await api.get('/orders/readprogress')
		const resFinalized = await api.get('/orders/readfinalized')

		setOrdersFinalizedList(resFinalized.data)
		setOrdersProgressList(resProgress.data)
	}

	Modal.setAppElement('#__next')

	return (
		<>
			<Head>
				<title>Pedidos | Pizza Hub</title>
			</Head>
			<Header />

			<main className={styles.container}>
				<div className={styles.ordersTrue}>
					<div className={styles.header}>
						<h1>Pedidos em Andamento</h1>
					</div>

					<div className={styles.content}>
						{ordersProgressList.length === 0 ? (
							<div className={styles.empty}>
								<h1>Nenhum pedido em andamento</h1>
							</div>
						) : (
							<article className={styles.ordersList}>
								{ordersProgressList.map((order) => {
									return (
										<section key={order.id} className={styles.items}>
											<button onClick={() => handleOpenModalView(order.id)}>
												<div className={styles.tag}></div>
												<span>Mesa {order.table}</span>
												<span> </span>
											</button>
										</section>
									)
								})}
							</article>
						)}
					</div>
				</div>

				<div className={styles.ordersFalse}>
					<div className={styles.header}>
						<h1>Pedidos Finalizados</h1>
					</div>

					<div className={styles.content}>
						<article className={styles.ordersList}>
							{ordersFinalizedList.map((order) => {
								return (
									<section key={order.id} className={styles.items}>
										<button onClick={() => handleOpenModalView(order.id)}>
											<div className={styles.tag}></div>
											<span>Mesa {order.table}</span>
										</button>
									</section>
								)
							})}
						</article>
					</div>
				</div>
			</main>

			{modalVisible && (
				<ModalOrder
					isOpen={modalVisible}
					onRequestClose={handleCloseModal}
					order={modalItem}
					handleFinishOrder={handleFinishItem}
				/>
			)}
		</>
	)
}

export const getServerSideProps = SSRAuth(async (ctx) => {
	const api = setupAPIClient(ctx as any)

	const ordersProgress = await api.get('/orders/readprogress')
	const ordersFinalized = await api.get('/orders/readfinalized')

	return {
		props: {
			ordersProgress: ordersProgress.data,
			ordersFinalized: ordersFinalized.data
		}
	}
})
