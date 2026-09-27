function randomSentence() {
    document.getElementById("sentence").innerText = getSentence();
};

function getSentence() {
    var sentence = ["","","","",""]; // CXT, SUB, VRB, OBJ, PST
    if (isChecked('cfgLa') && Math.random() < 0.25) {
        sentence[0] = getPhrase() + " la ";
    };
    sentence[1] = getPhrase();
    if (Math.random() < 0.25) {
        sentence[1] += ` o `;
    } else {
        if (!['mi','mi1','mi2','sina','sina1','sina2'].includes(sentence[1])) {
            sentence[1] += ` li `;
        };
    };
    sentence[2] = (Math.random() < 0.25 ? getPreverb() : "") + getPhrase();
    if (Math.random() < 0.9) {
        sentence[2] += " e ";
        sentence[3] = getPhrase();
        if (isChecked('cfgPreposition') && Math.random() < 0.25) {
            sentence[4] = " "+getWord(['preposition'],true)+"("+getPhrase()+")";
        };
    };
    console.log(sentence);
    return sentence.join("");
};

function isChecked(id) {
    return document.getElementById(id).checked;
};

function getPhrase() {
    var word = getWord(['content','head']);
    console.log(word);
    var mods = Math.randomInt(parseInt(document.getElementById('cfgModMin').value),parseInt(document.getElementById('cfgModMax').value)+1);
    console.log(mods);
    if (mods > 0) {
        let rnd = Math.random();
        if (isChecked("cfgLasina") && rnd < 0.1) {
            return word + getName();
        } else if (isChecked("cfgIjoAlaIjo") && rnd > 0.9) {
            return `{${word}}ala(${word})`;
        } else {
            var pi = false;
            for (let i = 0; i < mods; i++) {
                if (!pi && isChecked("cfgPi") && mods-i >= 3 && Math.random() < 0.25) {
                    word += " pi(";
                    pi = true;
                } else {
                    word += " "+getWord(['content','modifier']);
                };
            };
            return word + (pi ? ")" : "");
        };
    } else {
        return word;
    }
};

function getWord(classes=['content'],allowCore) {
    const word = words.filter(function(word) {
        if (!word || !word.cats) return false;
        if (!word.cats.shares(classes)) return false;
        if (!getStyles(word)) return false;
        if (!isChecked(`cfgNimi${word.linku.capitalize()}`) && ((allowCore && !word.linku === 'core') || !allowCore)) return false;
        if (word.name === 'unpa' && !isChecked('cfgUnpa')) return false;
        if (word.name === 'seme' && !isChecked('cfgSeme')) return false;
        if (word.cats.includes('book') && !isChecked('cfgBook')) return false;
        return true;
    }).random();
    if (word.styles) {
        return word.name+word.styles.random().toString().replace("0","");
    } else {
        return word.name;
    }
};

function getPreverb() {
    return getWord(['preverb'],true) + (Math.random() < 0.25 ? ' ala ' : " ");
};

function getStyles(word) {
    var styles = [];
    let name = word.cats.includes("gender") ? "gender" : word.cats.includes("pronoun") ? "pronoun" : word.name;
    if (word.styles) {for (let style of word.styles) {
        console.log(word,`cfg${name.capitalize()}${style}`);
        if (isChecked(`cfg${name.capitalize()}${style}`)) styles.push(style);
    }};
    return styles;
};

function getName() {
    var vowels = ['A','E','I','O','U']
    var consonants = ['J','K','L','M','N','P','S','T','W','']
    let i = 0
    let name = ''
    do {
        name += consonants.random();
        if (i === 0) consonants.pop(); //Remove the blank. These can only be generated for onset vowels.
        name += vowels.random();
        if (Math.random() < 0.5) name += 'N'; //n coda
        i++;
    } while ((i <= 2 && Math.random() < 0.5) || (i <= 5 && Math.random() < 0.1));
    if (name.includes('WU')) name = name.replaceAll('WU','JU');
    if (name.includes('WO')) name = name.replaceAll('WO','JO');
    if (name.includes('JI')) name = name.replaceAll('JI','LI');
    if (name.includes('TI')) name = name.replaceAll('TI','SI');
    if (name.includes('NN')) name = name.replaceAll('NN','N');
    if (name.includes('NM')) name = name.replaceAll('NM','M');
    return `[${name}]`;
};

String.prototype.capitalize = function() {
    return this.slice(0,1).toUpperCase()+this.slice(1);
};

Array.prototype.random = function() {
	if (!this) {return undefined;};
	return this[Math.floor(Math.random()*this.length)];
};
Array.prototype.shares = function(arr) {
	return this.some(e=>arr.includes(e))
};

Math.randomInt = function(min,max) {
    return Math.floor(min+(Math.random()*(max-min)));
};