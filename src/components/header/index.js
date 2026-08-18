import React from 'react'
import styles from './header.module.scss';
import Button from '../button';
const Logo = '/assets/logo/logo.png';
const RightIcon = '/assets/icons/right.svg';
export default function Header() {
    return (
        <header className={styles.header}>
            <div className='container'>
                <div className={styles.headerAlignment}>
                    <div className={styles.logo}>
                        <img src={Logo} alt="ChronosX Logo" />
                    </div>
                    <div className={styles.menu}>
                        <ul>
                            <li className={styles.active}><a href="#">Home</a></li>
                            <li><a href="#">AI Tools</a></li>
                            <li><a href="#">AI Chat</a></li>
                            <li><a href="#">AI Strategy</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">Resources</a></li>
                        </ul>
                    </div>
                    <Button text="Get Started" icon={RightIcon} />
                </div>
            </div>
        </header>
    )
}
