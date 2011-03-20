(function () {

var Converter = window.Converter = function () {},
	generatedIds = {};

function generateId(fieldName, prefix, postfix)
{
	var words = fieldName.toLowerCase().split(/\s/),
		results = words[0], n = 0;
	
	for (var i = 1; i < words.length; i++)
	{
		results += (words[i])[0].toUpperCase();
		results += (words[i]).substring(1);
	}
	
	results = [prefix || '', results, postfix || ''].join("");
	
	while (generatedIds[results + (n || '')])
	{
		n += 1;
	}
	
	generatedIds[results + (n || '')] = true;
	return results;
}

Converter.toForm = function (str, prefix, postfix) {
	var lines = str.split(/\r?\n/),
		i = 0, n = lines.length, tokens = [],
		bGenerateLabel = true,
		fieldName, fieldType,
		label, input,
		form = document.createElement('form');
	
	for (i = 0; i < n; i++)
	{
		bGenerateLabel = true;
		tokens = lines[i].split(/:\s?/);
		
		fieldName = tokens[0];
		fieldType = tokens[1];
		
		switch (fieldType) {
			case "text":
				input = document.createElement('input');
				input.type = fieldType;
				break;
			case "textarea":
				input = document.createElement('textarea');
				break;
			case "submit":
				input = document.createElement('input');
				input.type = 'submit';
				input.value = fieldName;
				bGenerateLabel = false;
				break;
		}
		
		input.id = generateId(fieldName);
		
		if (bGenerateLabel)
		{
			label = document.createElement('label');
			label.htmlFor = generateId(fieldName);
			label.innerHTML = fieldName;
			form.appendChild(label);
		}
		
		form.appendChild(input);
	}
	
	return form;
}

}())
