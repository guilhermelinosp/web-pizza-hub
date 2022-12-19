import React from 'react'
import styles from './styles.module.scss'

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const TextArea = ({ ...rest }: TextAreaProps) => {
	return <textarea className={styles.input} {...rest}></textarea>
}
