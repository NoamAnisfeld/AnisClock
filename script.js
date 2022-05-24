const S = 1000,
	M = S * 60,
	H = M * 60,
	D = H * 24;

function padZero(n) {
	return String(n).padStart(2, "0");
}

const clock = {
	hours: 0,
	minutes: 0,
	seconds: 0,

	offset: 0,

	update: function () {
		const timedate = new Date(new Date().valueOf() + this.offset);
		this.hours = timedate.getHours();
		this.minutes = timedate.getMinutes();
		this.seconds = timedate.getSeconds();
	},

	hoursView: document.getElementById("hours"),
	minutesView: document.getElementById("minutes"),
	secondsView: document.getElementById("seconds"),

	updateAndView: function () {
		this.update();
		this.hoursView.textContent = ((n) => (n === 0 || n === 12 ? 12 : n % 12))(
			this.hours
		);
		this.minutesView.textContent = padZero(this.minutes);
		this.secondsView.textContent = padZero(this.seconds);
	},

	initialized: false,

	init: function () {
		if (this.initialized) {
			throw "already initialized";
		}

		this.initialized = true;
		setInterval(this.updateAndView.bind(this), 100);
		this.minutesView.focus();
	},

	resetOffset: function () {
		this.offset = 0;
	},

	addToOffset(val) {
		this.offset = (this.offset + val) % D;
	},

	turnSecondsTo55: function () {
		if (this.seconds < 55) {
			this.addToOffset(S * (55 - this.seconds));
		}
	}
};

clock.init();

document.addEventListener("keyup", (e) => {
	let offsetFactor;

	switch (e.target) {
		case clock.hoursView:
			offsetFactor = H;
			break;

		case clock.minutesView:
			offsetFactor = M;
			break;

		case clock.secondsView:
			offsetFactor = S;
			break;

		default:
			return;
	}

	if (e.code === "ArrowUp") {
		clock.addToOffset(offsetFactor);
		clock.turnSecondsTo55();
		clock.updateAndView();
	} else if (e.code === "ArrowDown") {
		clock.addToOffset(-offsetFactor);
		clock.turnSecondsTo55();
		clock.updateAndView();
	}
});