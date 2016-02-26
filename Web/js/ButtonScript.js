$(document).ready(function() {
	$('#addnum').click(function() {
		console.log("I got this far! Yay!")
		var n1 = prompt("Please type a number.")
		var n2 = prompt("Please type another number.")
		var sum = parseInt(n1) + parseInt(n2)
		window.alert("Your number is: " + sum)
	});
});
