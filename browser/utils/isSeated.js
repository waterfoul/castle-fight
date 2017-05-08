export function isSeated(user, room) {
	for(let i = 0; i < 4; i++) {
		if(
			room['Blue' + i] && room['Blue' + i].id === user.id ||
			room['Red' + i] && room['Red' + i].id === user.id
		) {
			return true;
		}
	}
	return false;
}