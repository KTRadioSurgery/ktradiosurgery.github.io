
function calcBED()
{
	var Dose = document.BEDform.Dose.value;
	var Fracs = document.BEDform.Fracs.value;
	var AB = document.BEDform.AB.value;

	var BED = parseFloat(Fracs)*parseFloat(Dose)*(1+parseFloat(Dose)/AB);

	var BED2 = parseFloat(Fracs)*parseFloat(Dose)*(1+parseFloat(Dose)/2);
	var BED3 = parseFloat(Fracs)*parseFloat(Dose)*(1+parseFloat(Dose)/3);
	var BED4 = parseFloat(Fracs)*parseFloat(Dose)*(1+parseFloat(Dose)/4);
	var BED5 = parseFloat(Fracs)*parseFloat(Dose)*(1+parseFloat(Dose)/5);


	document.getElementById('BED').value = BED;

	document.getElementById('BED2').value = BED2;
	document.getElementById('BED3').value = BED3;
	document.getElementById('BED4').value = BED4;
	document.getElementById('BED5').value = BED5;

}

