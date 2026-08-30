"use client";
import React from 'react';
import { motion } from 'framer-motion';
import styles from './button.module.scss';
import classNames from 'classnames';

export default function Button({ text, icon, onClick, btnmd, type = "button" }) {
    return (
        <div className={classNames(styles.button, btnmd ? styles.btnmd : "")}>
            <motion.button
                type={type}
                onClick={onClick}
                aria-label={text}
                whileHover="hover"
                whileTap="tap"
                initial="rest"
                variants={{
                    rest: { scale: 1, boxShadow: "0 4px 20px rgba(24, 201, 139, 0.35)" },
                    hover: {
                        scale: 1.04,
                        boxShadow: "0 0 25px rgba(24, 201, 139, 0.7), 0 0 50px rgba(24, 201, 139, 0.4)",
                        transition: { type: "spring", stiffness: 400, damping: 15 }
                    },
                    tap: {
                        scale: 0.96,
                        transition: { duration: 0.1 }
                    }
                }}
            >
                <span className={styles.btnText}>{text}</span>
                {icon && (
                    <motion.span
                        className={styles.iconWrapper}
                        variants={{
                            rest: { x: 0 },
                            hover: { x: 4, transition: { type: "spring", stiffness: 400, damping: 15 } }
                        }}
                    >
                        <img src={icon} alt={text} />
                    </motion.span>
                )}
            </motion.button>
        </div>
    );
}
