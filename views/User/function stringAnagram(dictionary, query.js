function getPasswordStrength(passwords, common_words) {
  // for(let i = 0; i < passwords.length; i++){
  //     if(common_words.includes(passwords[i])){
  //        return "weak"
  //     }else if(passwords.includes(common_words[i])){
  //         return "weak"
  //     }else if(!passwords.some(isNaN)){

  //     }else if(passwords.filter(ele=> ele.toUpperCase()))

  // }

  const weakPasswords = new Set(common_words);
  const results = [];
  for (let i = 0; i < passwords.length; i++) {
    const password = passwords[i];
    let isWeak = false;

    if (weakPasswords.has(password.toLowerCase())) {
      isWeak = true;
    }
    for (let j = 0; j < password.length; j++) {
      for (let k = j + 1; k <= password.length; k++) {
        const subStr = password.substring(j, k);
        if (weakPasswords.has(subStr.toLowerCase())) {
          isWeak = true;
          break;
        }
      }
    }

    if (/^[A-Z]+$/.test(password) || /^[a-z]+$/.test(password)) {
      isWeak = true;
    }
    if (password.length < 6) {
      isWeak = true;
    }
    results.push(isWeak ? 'weak' : 'strong');
  }

  return results;
}

getPasswordStrength(
  ['iliketoCoDe', 'teaMAKEsmehappy', 'blackcoffeeISthebest'],
  ['coffee', 'coding', 'happy']
);
