import React from 'react';
//import Navbar from "./Navbar";
//import './style/css/index.css';
const testbooks = [
	{
		Title: 'Lord of the Rings ',
		Author: 'J.R.R Tolkin ',
		Genre: 'Adult Fantasy ',
		Trope: 'Found Family ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '11th grade + ',
	},
	{
		Title: 'Pride and Prejudice ',
		Author: 'Jane Austen ',
		Genre: 'Historical Fiction ',
		Trope: 'Enemies to Lovers ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '9th grade + ',
	},
	{
		Title: 'Six of Crows ',
		Author: 'Leigh Bardugo ',
		Genre: 'YA Fantasy ',
		Trope: 'found family ',
		Status: 'Complete ',
		Start_Date: '04/23/26 ',
		End_Date: '05/22/26 ',
		Reading_Level: '7th grade + ',
	},
];

function MyApp() {
	return (
		<div className="container">
			<Table />
		</div>
	);
}

function TableBody(props) {
	const rows = props.BookData.map((row, index) => {
		return (
			<tr key={index}>
				<th>Title </th>
				<td>{row.Title}</td>

				<th>Author </th>
				<td>{row.Author}</td>

				<th>Genre </th>
				<td>{row.Genre}</td>

				<th>Trope </th>
				<td>{row.Trope}</td>

				<th>Status </th>
				<td>{row.Status}</td>

				<th>Start_Date </th>
				<td>{row.Start_Date}</td>

				<th>End_Date </th>
				<td>{row.End_Date}</td>

				<th>Reading_Level</th>
				<td>{row.Reading_Level}</td>
			</tr>
		);
	});
	return <tbody>{rows}</tbody>;
}

function Table() {
	return (
		<main className="landing">
			<section className="table">
				<table>
					<TableBody BookData={testbooks} />
				</table>
			</section>
		</main>
	);
}

export default Table;
