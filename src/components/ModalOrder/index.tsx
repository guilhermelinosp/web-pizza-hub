import React from 'react'
import Modal from 'react-modal'
import styles from './styles.module.scss'
import { FiX } from 'react-icons/fi'
import { OrderItemProps } from '../../pages/dashboard'

interface ModalOrderProps {
	isOpen: boolean
	onRequestClose: () => void
	order: OrderItemProps[] | undefined
	handleFinishOrder: (id: string) => void
}

export const ModalOrder = ({
	isOpen,
	onRequestClose,
	order,
	handleFinishOrder
}: ModalOrderProps) => {
	const customStyles = {
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			transform: 'translate(-50%, -50%)',
			background: 'var(--background)',
			color: 'var(--text)',
			border: 'none',
			borderRadius: '0.5rem',
			width: '100%',
			maxWidth: '40rem',
			padding: ' 2rem'
		}
	}

	return (
		<Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
			<button
				type="button"
				onClick={onRequestClose}
				className="react-modal-close"
				style={{
					position: 'absolute',
					right: '1.6rem',
					top: '1.6rem',
					border: 'none',
					background: 'transparent'
				}}
			>
				<FiX size={45} color="#f00" />
			</button>

			<div className={styles.container}>
				<h1>Detalhes do Pedido</h1>
				<h2 className={styles.table}>Mesa {order![0].order.table}</h2>

				<div className={styles.orders}>
					{order!.map(item => (
						<section key={item.id} className={styles.items}>
							<div className={styles.item}>
								<span>
									{item.amount} - <strong>{item.product.name}</strong>{' '}
								</span>
								<span>R$ {item.product.price},00</span>
							</div>
						</section>
					))}
				</div>

				{order![0].order.status === false && (
					<button
						className={styles.buttonFinish}
						onClick={() => handleFinishOrder(order![0].order_id)}
					>
						Finalizar Pedido
					</button>
				)}
			</div>
		</Modal>
	)
}
