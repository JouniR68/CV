import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "../../../firebase"
import { Link } from "react-router-dom";

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
import { useAuth } from "../../LoginContext";
import { NoteAdd } from "@mui/icons-material";
import "../../../css/tarjous.css"

const ShowOrders = () => {
	const { currentUser } = useAuth();

	const navigate = useNavigate();
	const { t } = useTranslation();

	const [orderReqs, setorderReqs] = useState([])
	const [error, setError] = useState("")

	const getOrderReqs = async () => {
		try {
			const orderReqsRef = collection(db, "tarjouspyynto")
			const querySnapshot = await getDocs(orderReqsRef)
			const data = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				ref: doc.ref,
				...doc.data(),
			}))
			console.log("Tilaukset getOrder: ", data)
			if (!data) {
				navigate('/error', { state: { locationError: "No data" } })
				return
			} else {
				console.log("Adding data to customer")
				setorderReqs(data)
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
		getOrderReqs()
	}, [])

	const markCompleted = async (id, status) => {
		try {
			console.log("firebase doc id:", id);
			const orderRef = collection(db, "tarjouspyynto");
			const docRef = doc(orderRef, id);

			await updateDoc(docRef, {
				status: !status
			})
			getOrderReqs()
		} catch (error) {
			console.error("Error updating field: ", error)
		}
	}


	let counter = 1;

	console.log("reqs: ", orderReqs)

	return (
		<div >
			<TableContainer component={Paper} className="pyynnot">
				{error.length > 1 && <h3>{error}</h3>}	
					<Table aria-label="simple table" key={counter++}>

						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Pyydetty</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Alue</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Nimi</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="right">Osoite</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Sähköposti</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Puhelin</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Y-tunnus</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Viesti</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Tiedostot</TableCell>
								<TableCell sx={{ fontWeigth: 'bold' }} align="left">Hoidettu</TableCell>
							</TableRow>
						</TableHead>

						{orderReqs.map(o => (
							<TableBody key={counter++}>
								<TableRow>
									<TableCell>{o.arrived}</TableCell>
									<TableCell>{o.area}</TableCell>
									<TableCell>{o.firstname} {o.lastname}</TableCell>
									<TableCell>{o.address}</TableCell>
									<TableCell>{o.email}</TableCell>
									<TableCell>{o.phone}</TableCell>
									<TableCell>{o.yTunnus}</TableCell>
									<TableCell>{o.message}</TableCell>

									<TableCell>
										{Array.isArray(o.files) && o.files.length > 0 ? (
											o.files.map((file, index) => (
												<Link key={index++} to={file}>
													FILE
												</Link>
											))
										) : (
											<span> Ei tiedostoja</span>
										)}
									</TableCell>

									<TableCell key={counter++}>
										<Button variant="contained" key={o.id} onClick={() => markCompleted(o.id, o.status)}>{o.status ? "kuitattu" : "ei huomioitu"}</Button>
									</TableCell>
								</TableRow>
							</TableBody>
						))}

					</Table>				
			</TableContainer>
		</div>

	)
}

export default ShowOrders;