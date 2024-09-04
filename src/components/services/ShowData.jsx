import { useState, useEffect } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from "../../firebase"

import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../LoginContext";

const ShowOrders = () => {
	const { currentUser } = useAuth();

	const navigate = useNavigate();
	const { t } = useTranslation();
	const [locations, setLocations] = useState([])
	const [orders, setOrders] = useState([])
	const [error, setError] = useState("")
	const [cro, setCro] = useState(false)

	const getOrders = async () => {
		try {
			const orderRef = collection(db, "orders")
			const querySnapshot = await getDocs(orderRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			console.log("Tilaukset getOrder: ", data)
			if (!data) {
				navigate('/error', { state: { locationError: "No data" } })
				return
			} else {
				console.log("Adding data to customer")
				setOrders(data)
			}
		} catch (error) {
			console.error("Error fetching data: ", error)
			setError("Error fetching data, pls contact site admin.")
			throw {
				message: "Datan haku epäonnistui",
				statusText: "Failas",
				status: 403,
			}
		}
	}

	useEffect(() => {
		getOrders();
	}, [])


	const deletor = async (id) => {

		// Get a reference to the document		
		console.log("Deletor with id:", id);
		const collectionRef = collection(db, "orders");
		const docRef = doc(collectionRef, id);

		console.log("docRef: ", docRef)
		deleteDoc(docRef)
			.then(() => {
				console.log("The document successfully deleted")
				navigate('/done', { state: { description: `${id} deleted` } })
			})
			.catch(((error) => {
				console.error("Error removing document: ", error)
				navigate('/error', { state: { locationError: `${id} deleting failed.` } })
			}))

	}

	console.log("Tilaukset: ", orders)

	const tilausNro = orders.map(ord => ord.items.map(t => t.tilausnro))


	const orderData = orders.map(s => s.items.filter(e => e.id != ""))
	orderData.forEach((order) => console.log(order.map(r => console.log(r.id))))
	


	let counter = 0;
	return (
		<>
			<TableContainer component={Paper}>
				{error.length > 1 && <h3>{error}</h3>}
				<h4>Tilausnro: <span style={{color:'red'}}>{tilausNro}</span></h4>
				<Table sx={{ minWidth: 650 }} aria-label="simple table" key={counter++}>

					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">ID</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="right">Otsikko</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Kuvaus</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Tuntimäärä</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Tuntihinta</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Toiminto</TableCell>
						</TableRow>
					</TableHead>


					{orderData.map(i => i.map(order => 
						<TableBody key={counter++}>
							<TableRow>
								<TableCell>{order.id}</TableCell>
								<TableCell>{order.title}</TableCell>
								<TableCell>{order.description}</TableCell>
								<TableCell>{order.kpl}</TableCell>
								<TableCell>{order.priceh}</TableCell>
								<Button onClick={() => deletor(i.id)}>Delete</Button>
							</TableRow>
						</TableBody>
					))}
				</Table>
				</TableContainer>
				
				<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table" key={counter++}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Etunimi</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="right">Sukunimi</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Osoite</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Puhelin</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Sähköposti</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">Viesti</TableCell>							
						</TableRow>
					</TableHead>

					{orderData.map(i => i.map(contact => 
						<TableBody key={counter++}>
							<TableRow>
								<TableCell>{contact.Etunimi}</TableCell>
								<TableCell>{contact.Sukunimi}</TableCell>
								<TableCell>{contact.Osoite}</TableCell>
								<TableCell>{contact.Puhelin}</TableCell>
								<TableCell>{contact.Sähköposti}</TableCell>
								<TableCell>{contact.Viesti}</TableCell>								
							</TableRow>
						</TableBody>
					))}
				</Table>
			</TableContainer>
		</>

	)
}

export default ShowOrders;