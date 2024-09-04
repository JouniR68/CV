import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore"
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
	const [done, setDone] = useState("Kesken/ei aloitettu")
	const [cro, setCro] = useState(false)

	const getOrders = async () => {
		try {
			const orderRef = collection(db, "orders")
			const querySnapshot = await getDocs(orderRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				ref:doc.ref,
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

	const markCompleted = async (ref, id) => {
		try {
			console.log("ref: " + ref + ", job id:", id);
			const orderRef = collection(db, "orders");
			const docRef = doc(orderRef);
			await updateDoc(docRef, {
				items: arrayUnion({completed: done})
			})
			setDone("Laskutettu")
			alert("Merkitty tehdyksi")
		} catch (error) {
			console.error("Error updating field: ", error)
		}
	}

	console.log("orders: ", orders)
	//<h4>Tilausnro: <span style={{ color: 'red' }}>{tilausNro}</span></h4>
	const orderData = orders.map(s => s.items?.filter(e => Object.keys(e).length > 0))
	console.log("orderData: ", orderData)
	//const tilausNro = orderData.map(ord => ord.tilausnro)
	//console.log("tilausNro: ", tilausNro)
	console.log("Tilaukset: ", orderData)
	const descriptions = orderData.map(ord => ord?.map(o => o.description))
	console.log("descrips: ", descriptions)
	
	/*orderData.forEach(order => {
		console.log("orderData, order: ", order)

		if (Array.isArray(order.description)) {
			console.log("description is an array..")
		} else {
			console.warn("Description is not an array or is undefined for order:", order);
		}
	});
*/



	let counter = 0;
	return (
		<>
			<TableContainer component={Paper}>
				{error.length > 1 && <h3>{error}</h3>}
				
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


					{orderData.map(order => (
						order?.map((o) => (
							
						<TableBody key={counter++}>
							<TableRow>
								<TableCell>{o.id}</TableCell>
								<TableCell>{o.title}</TableCell>
								<TableCell>{descriptions}</TableCell>
								<TableCell>{o.kpl}</TableCell>
								<TableCell>{o.priceh}</TableCell>
								<Button onClick={() => markCompleted(o.ref, o.id)}>{done}</Button>
							</TableRow>
						</TableBody>
					))))}
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

					{orderData.map(i => i?.map(contact =>
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