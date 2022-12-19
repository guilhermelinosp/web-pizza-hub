import React from 'react'
import Link from 'next/link'
import styles from './styles.module.scss'
import { FiLogOut } from 'react-icons/fi'
import { AuthContext } from '../../context/AuthContext'

export const Header = () => {
	const { signOut } = React.useContext(AuthContext)

	return (
		<header className={styles.container}>
			<div className={styles.title}>
				<h1>Pizza Hub</h1>
			</div>

			<div className={styles.content}>
				<nav>
					<Link href={'/dashboard'}>
						<p>Pedidos</p>
					</Link>
					<Link href={'/categories'}>
						<p>Categorias</p>
					</Link>
					<Link href={'/products'}>
						<p>Produtos</p>
					</Link>
				</nav>
				<button onClick={signOut}>
					<FiLogOut color="#fff" size={24} />
				</button>
			</div>
		</header>
	)
}
