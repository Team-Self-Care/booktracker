import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';
import './style/css/index.css';
import Form from './components/Log_In_Form.jsx';
import Table from './components/List.jsx';
createRoot(document.getElementById('root')).render(
	<StrictMode>
		<Table />
	</StrictMode>
);
