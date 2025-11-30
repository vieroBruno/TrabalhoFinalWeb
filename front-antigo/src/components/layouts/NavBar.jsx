import {  Link } from 'react-router';
import styles from './Navbar.module.css'
import Container from './Container';
import  {RiShoppingCart2Line} from "react-icons/ri";
import { AiOutlineHome } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { RiShoppingBag3Line } from "react-icons/ri";
import { BsClipboard } from "react-icons/bs";


export default function NavBar(){
    return(
        <nav className={styles.navbar}>
            <Container>
                <div className={styles.title}>
                    <Link to="/" ><RiShoppingCart2Line size={40} /></Link>
                    <Link to="/" ><h1>Store</h1></Link>
                </div>
                <ul className={styles.list}>
               
                    <li className={styles.item}>
                        <Link to="/" ><AiOutlineHome size={25} /></Link>        
                        <Link to="/" >Home</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/categories" > <BiCategory size={25}/></Link>
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li className={styles.item}>
                        <Link to="/products" ><RiShoppingBag3Line  size={25} /> </Link>
                        <Link to="/products">Products</Link>
                    </li >
                    <li className={styles.item}>
                        <Link to="/histories" > <BsClipboard  size={25} /></Link>
                        <Link to="/histories">History</Link>
                    </li>
                </ul>
            </Container>
        </nav>
    )
}

