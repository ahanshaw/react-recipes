export function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="footer">
			<p>Site by Angie Hanshaw &copy;{currentYear}</p>
        </footer>
    );
}