import { useEffect, useState } from 'react';
import HistoryTable from '../History/HistoryTable'
import styles from './History.module.css'
import Modal from 'react-modal';
import ModalTable from '../History/ModalTable';

const urlApiModal = 'http://localhost/apiModalHistory.php?index='
const urlApiHistory = "http://localhost/apiHistory.php"
export default function Histories() {
    const [history,setHistory] = useState([])
    const [open,setOpen] = useState(false)
    const [modal,setModal] = useState([])
    
    const handleClose = () => setOpen(false);

    async function handleOpen(code) {
        await getModal( urlApiModal + code)
        setOpen(true)
    }

    async function getModal(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setModal(data);
        } catch (e) {
            console.error(e)
        }
    }

    async function getHistory(url) {
        try {
            const res = await fetch(url);
            const data = await res.json();
            setHistory(data);
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getHistory(urlApiHistory)
    },[])

    return (
        <div className={styles.history_container}>
            <h1>History</h1>
            <HistoryTable history={history} handleOpen={handleOpen}/>
                <Modal
                isOpen={open}
                onRequestClose={handleClose}
                className={styles.modal_container}
                ariaHideApp={false}>
                    <ModalTable modal={modal} />
                </Modal>
        </div>
    )
}