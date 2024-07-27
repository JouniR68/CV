import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
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

const ShowCustomers = () => {
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


	const getLocations = async () => {
		try {
			const locationRef = collection(db, "locations")
			const querySnapshot = await getDocs(locationRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}))									
			setLocations(data)
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
		getLocations();
	}, [])


	const {t} = useTranslation()
	console.log(locations)

	const handleCro = () => {
		setCro(!cro)
	}

	const sortedLocations = [...locations].sort((a, b) => { 		
		return new Date(b.detail).toLocaleDateString() - new Date(b.detail).toLocaleTimeString()
	})

	
	return (

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

			<Table sx={{ minWidth: 650 }} aria-label="simple table" key={nanoid()}>
				<TableHead>
					<TableRow>
						<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('Location')}</TableCell>
						<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('target')}</TableCell>
						<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('pvm')}</TableCell>
						<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('time')}</TableCell>	
						<TableCell sx={{ fontWeigth: 'bold' }} align="left">{t('place')}</TableCell>						
					</TableRow>
				</TableHead>

				{!cro && <Button onClick = {handleCro}>{t('croatia')}</Button>}
				{cro && locations.map((l) => (
					l.detail.includes('Croatia') && <TableBody key={nanoid()}>
						{(!l.detail.includes('Vuohennokantie 7') && !l.detail.includes('Katila')) && <TableRow key={nanoid()}>
							<TableCell>{l.detail}</TableCell>
							<TableCell>{l.target}</TableCell>
							{l.pvm != null && <TableCell>{l.pvm}</TableCell>}
							{l.time != null && <TableCell>{l.time}</TableCell>}
							{l.place != null && <TableCell>{l.place}</TableCell>}
						</TableRow>}
					</TableBody>
				))}

				{cro && <Button onClick = {handleCro}>{t('finland')}</Button>}
				{!cro && locations.map((l) => (
					l.detail.includes('Finland') && <TableBody key={nanoid()}>
						{(!l.detail.includes('Vuohennokantie 7') && !l.detail.includes('Katila')) && <TableRow key={nanoid()}>
							<TableCell>{l.detail}</TableCell>
							<TableCell>{l.target}</TableCell>
							{l.pvm != null && <TableCell>{l.pvm}</TableCell>}
							{l.time != null && <TableCell>{l.time}</TableCell>}
							{l.place != null && <TableCell>{l.place}</TableCell>}
						</TableRow>}
					</TableBody>
				))}

			</Table>



		</TableContainer>

	)
}

export default ShowCustomers;