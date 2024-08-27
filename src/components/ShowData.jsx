import { useState, useEffect } from "react"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"
import { nanoid } from 'nanoid'

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
import { ConstructionOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const ShowCustomers = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [locations, setLocations] = useState([])
	const [customer, setCustomer] = useState([])
	const [error, setError] = useState("")
	const [cro, setCro] = useState(false)

	const getContracts = async () => {
		try {
			const customerRef = collection(db, "messages")
			const querySnapshot = await getDocs(customerRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			console.log("Messages: ", data)
			if (!data) {
				navigate('/error', { state: { locationError: "No data" } })
				return
			} else {
				console.log("Adding data to customer")
				setCustomer(data)				
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
		getContracts();
	}, [])


	const deletor = async (id) => {

		// Get a reference to the document		
		console.log("Deletor with id:", id);
		const collectionRef = collection(db, "messages");
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

	console.log("customer: ", customer)

	return (
		<>
			<TableContainer component={Paper}>
				{error.length > 1 && <h3>{error}</h3>}
				<Table sx={{ minWidth: 650 }} aria-label="simple table" key={nanoid()}>

					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Firstname')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="right">{t('Lastname')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Email')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Phone')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Firm Id')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Description')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Created')}</TableCell>
							<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Action')}</TableCell>
						</TableRow>
					</TableHead>


					{customer.map((t) => (								
						<TableBody key={nanoid()}>
							<TableRow key={nanoid()}>
								<TableCell>{t.fName}</TableCell>
								<TableCell>{t.lName}</TableCell>
								<TableCell>{t.address}</TableCell>
								<TableCell>{t.email}</TableCell>
								<TableCell>{t.phone}</TableCell>
								<TableCell>{t.description}</TableCell>
								<TableCell>{t.pvm}</TableCell>
								<Button onClick={() => deletor(t.id)}>Delete</Button>
							</TableRow>
						</TableBody>
					))}
				</Table>
			</TableContainer>
		</>

	)
}

export default ShowCustomers;