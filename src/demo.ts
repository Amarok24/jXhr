/*
Demo of Oxhr, an object-oriented XHR (XMLHttpRequest) wrapper/library.
https://github.com/Amarok24/Oxhr
*/

import { Oxhr } from "./oxhr.js";
import type { IOxhrParams, IRequestHeader } from "./oxhr_types.js";

const startButton = document.querySelector<HTMLButtonElement>("#startButton");
const abortButton = document.querySelector<HTMLButtonElement>("#abortButton");
const swButton = document.querySelector<HTMLButtonElement>("#swButton");
const loadProgress = document.querySelector<HTMLProgressElement>("#loadProgress");
const loadBytes = document.querySelector<HTMLElement>("#loadBytes");


// -=-=-= A VERY BASIC USAGE EXAMPLE =-=-=-
// Call FetchRandomStarWarsData() as many times as you want to fetch another random StarWars data. See also the browser console.

async function fetchRandomStarWarsData() {
	let response: any;
	const random: number = Math.floor(Math.random() * 10 + 1);

	const mySimpleOptions: IOxhrParams = {
		url: `https://swapi.dev/api/people/${random}`,
		// I also recommend this free API for testing: https://webhook.site/
		consoleInfo: "Establishing my simple test connection...",
		onLoadEnd: () => {
			alert(response);
		}
	};

	// The shortest possible call if you don't care about the return type.
	const mySimpleConnection = new Oxhr(mySimpleOptions);

	// Send request to the server and output response data to console.
	response = await mySimpleConnection.send();
	console.log(response);
}



// -=-=-= A MORE ADVANCED USAGE EXAMPLE =-=-=-
// You may set network throttling to slow 3G or fast 3G to try out the Abort button.

const myRequestHeaders: IRequestHeader[] = [
	/*
		{
			header: "Accept",
			value: "application/json" // Necessary for some servers.
		},
		{
			header: "Content-Type",
			value: "application/json" // Necessary for some servers.
		},
	*/
];

const myOptions: IOxhrParams = {
	// Attention, daily.json is quite large, 29 Mb
	url: "https://api.covidtracking.com/v1/states/daily.json",
	// url: "https://webhook.site/4542eb6f-60f6-4643-b6df-af56e24bed1e",
	method: "GET",
	responseType: "json",
	// data: `{ "test": 123 }`, -- Data may be passed before calling the 'send' method.
	requestHeaders: myRequestHeaders,
	timeoutMs: 7000,
	consoleInfo: "Establishing my test connection...",
	onLoadEnd: onLoadEnd,
	onTimeOut: onTimeOut,
	onProgress: onProgress,
	onAbort: onAbort
};

interface IJsonResponse {
	someFixedResponseData: number;
}

const myConnection: Oxhr<IJsonResponse> = new Oxhr<IJsonResponse>(myOptions);
// Or shorter with type inference:
// const myConnection = new Oxhr<IJsonResponse>(myOptions);


async function tryToSendData(): Promise<void> {
	let response: IJsonResponse;
	const myData = `{ "test": 123 }`;

	try {
		console.log("AWAITING DATA");
		// In this example we pass the data to be sent with request with the 'send' method.
		response = await myConnection.send(myData);
		console.log("ALL DATA RECEIVED");

		if (response && response.someFixedResponseData === 123) {
			// You won't get this response, of course, that's just an example.
			console.log("We got someFixedResponseData 123");
		}
		else {
			console.log("HTML response OK, but someFixedResponseData not received.");
		}

		// Attention, daily.json is quite large, 29 Mb
		// console.log(response);
	}
	catch (err) {
		// 'err' is error message from "reject( new Error() )" lines in oxhr.ts
		console.log(`An error occured, but we handled it. Error message: ${err.message}`);
	}
}


function onProgress(percent: number, bytes: number): void {
	// Very often the total filesize is not known, in such a case percent will be -1
	if (loadProgress) loadProgress.value = percent;
	if (loadBytes) loadBytes.innerText = bytes + " bytes";
}


function onAbort(): void {
	console.log("demo: custom abort handler");
}


function onLoadEnd(): void {
	console.log(`demo: custom loadend handler, readyState = ${myConnection.readyState}`);

}


function onTimeOut(): void {
	console.log("demo: custom timeout handler");
}

function handleStartButtonClick() {
	console.log(`start: handleStartButtonClick readyState = ${myConnection.readyState}`);
	if (loadProgress) loadProgress.value = 0;
	if (loadBytes) loadBytes.innerText = "0 bytes";

	tryToSendData();

	console.log("end: handleStartButtonClick");
}

function handleAbortButtonClick() {
	console.log("start: handleAbortButtonClick");
	myConnection.abort();
	console.log("end: handleAbortButtonClick");
}


if (startButton) startButton.addEventListener("click", handleStartButtonClick);
if (abortButton) abortButton.addEventListener("click", handleAbortButtonClick);
if (swButton) swButton.addEventListener("click", fetchRandomStarWarsData);


fetchRandomStarWarsData(); // see console output
