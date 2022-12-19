import React from 'react'
import styles from './styles.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	loading?: boolean
}

export const Button = ({ loading, children, ...rest }: ButtonProps) => {
	return (
		<button className={styles.button} disabled={loading} {...rest}>
			{loading ? (
				<AiOutlineLoading color="#FFF" size={24} />
			) : (
				<a className={styles.title}>{children}</a>
			)}
		</button>
	)
}
