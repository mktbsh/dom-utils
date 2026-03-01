export function onNetworkChange(callback: (online: boolean) => void): () => void {
	const onOnline = () => callback(true);
	const onOffline = () => callback(false);
	window.addEventListener("online", onOnline);
	window.addEventListener("offline", onOffline);
	return () => {
		window.removeEventListener("online", onOnline);
		window.removeEventListener("offline", onOffline);
	};
}
