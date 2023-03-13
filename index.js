const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { SerialPort } = require('serialport');

const app = express();
app.use(bodyParser.json());

// Enable CORS for all origins
app.use(cors());

app.post('/log', async (req, res) => {
	const { body } = req;
	console.log('body', body);
	res.json({ id: body.id, server: true });

	// Communicate with serial port
	try {
		const ports = await SerialPort.list();
		console.log('Available ports:');
		ports.forEach((port) => console.log(port.path));

		const portPath = ports[1].path;
		const port = new SerialPort({ path: portPath, baudRate: 9600 });
		console.log(`Port ${portPath} opened`);

		port.on('data', (data) => {
			console.log('Received:', data.toString());
		});

		port.write('Hello World!');
	} catch (err) {
		console.error('Error communicating with serial port:', err);
	}
});

app.listen(5432, () => {
	console.log('Server listening on port 5432');
});
