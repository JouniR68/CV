import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import {nanoid} from 'nanoid'

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';

const ShowCustomers = () => {
	//<TableCell>{t.firmId}</TableCell>
	const [customer, setCustomer] = useState([])
	const [error, setError] = useState("")

	const getContracts = async () => {
		try {
			const customerRef = collection(db, "Firma")
			const querySnapshot = await getDocs(customerRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))
			console.log("Customer data: ", data)
			setCustomer(data)
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
		getContracts()
	}, [])

	return (
		
		<TableContainer component={Paper}>
			{error.length > 1 && <h3>{error}</h3>}
			<Table sx={{ minWidth: 650 }} aria-label="simple table" key={nanoid()}>

				<TableHead>
					<TableRow>
						<TableCell sx={{fontWeigth:'bold'}} align="left">First Name</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="right">Last Name</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="left">Email</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="left">Phone</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="left">Firm Id</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="left">Description</TableCell>
						<TableCell sx={{fontWeigth:'bold'}} align="left">Created</TableCell>
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
							</TableRow>
						</TableBody>
					))}
			</Table>
		</TableContainer>
	)
}

export default ShowCustomers;