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


function parseFieldInfo(text)
{
	// Target: be able to parse this:
	// text#id.class1.class2(data-type='email',name='id')
	
	var pairListRegex = /\((.*?)\)/, pairList = null, // Matches ( soemthing )
		idRegex = /#([\w\-]+)/, id = null, // Matches #idName
		classesRegex = /\.([\w\-]+)/g, classes = [], // Matches .class-name
		type = null, results = [],
		attribs = {};
	
	type = text.match(/\w+/);
	type = type ? type[0] : null;
	id = text.match(idRegex);
	id = id ? id[1] : null;
	
	while ((results = classesRegex.exec(text)) != null)
	{
		classes.push(results[1]);
	}
	
	pairList = text.match(pairListRegex);
	pairList = pairList ? pairList[1] : null;
	if (pairList)
	{
		pairList = pairList.split(',');
		for (var i = 0, n = pairList.length; i < n; i++)
		{
			var pair = pairList[i].split('='),
				key = pair[0],
				value = pair[1] ? (pair[1].match(/(['"]*)(.*)\1/))[2] : ''; // Match to get the inside of a quoted string
			
			attribs[key] = value;
		}
	}
	
	return {
		type:type,
		id:id,
		class:classes,
		attributes:attribs
	};
}

Converter.toForm = function (str, prefix, postfix) {
	var lines = str.split(/\r?\n/),
		idMap = {},
		tokens = [],
		bGenerateLabel = true,
		fieldName, fieldInfo, label, input,
		form = document.createElement('form');
	
	for (var i = 0, n = lines.length; i < n; i++)
	{
		bGenerateLabel = true;
		tokens = lines[i].match(/(.*?):(.*)/);
		
		fieldName = tokens[1];
		fieldInfo = parseFieldInfo(tokens[2]);
		
		switch (fieldInfo.type) {
			case "text":
				input = document.createElement('input');
				input.type = 'text';
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
		
		input.id = fieldInfo.id || generateId(fieldName, idMap);
		
		if (fieldInfo.class && fieldInfo.class.length)
		{
			input.className = fieldInfo.class.join(' ');
		}
		
		for (var attrib in fieldInfo.attributes)
		{
			input.setAttribute(attrib, fieldInfo.attributes[attrib]);
		}
		
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
