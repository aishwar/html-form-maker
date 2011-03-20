(function () {

var Converter = window.Converter = function () {};

function generateId(fieldName, idMap, prefix, postfix)
{
	var n = 0;
	prefix = prefix || '';
	postfix = postfix || '';
	
	fieldName = fieldName.toLowerCase().replace(/\s(\w)/g, function(all, letter) {
		return letter.toUpperCase();
	});
	
	fieldName = prefix + fieldName + postfix;
	
	while (idMap[fieldName + (n || '')])
	{
		n += 1;
	}
	
	fieldName = fieldName + (n || '');
	idMap[fieldName] = true;
	
	return fieldName ;
}

Converter.toForm = function (str, prefix, postfix) {
	var lines = str.split(/\r?\n/),
		idMap = {},
		tokens = [],
		bGenerateLabel = true,
		fieldName, fieldType, label, input,
		form = document.createElement('form');
	
	for (var i = 0, n = lines.length; i < n; i++)
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
		
		input.id = generateId(fieldName, idMap);
		
		if (bGenerateLabel)
		{
			label = document.createElement('label');
			label.htmlFor = input.id;
			label.innerHTML = fieldName;
			form.appendChild(label);
		}
		
		form.appendChild(input);
	}
	
	return form;
}

}())
