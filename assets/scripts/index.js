const waitingLogo = waitingLogoControl()
waitingLogo.show()

document.getElementById('form').addEventListener('submit', handleSubmit)

function handleSubmit(event) {
    event.preventDefault()
    cleanWarns()

    const { gender, age, weight, height, activityLevel, success } = getValues()

    const { tmb, maintence, loseWeight, gainWeight } = calcAll(gender, age, weight, height, Number(activityLevel))

    if(success) {
        waitingLogo.hide()
        document.getElementById('results').innerHTML = `
            <ul>
                <li>
                    Seu metabolismo basal é de <strong>${tmb} calorias</strong>.
                </li>
                <li>
                    Para manter o seu peso você precisa consumir em média <strong>${maintence} calorias</strong>.
                </li>
                <li>
                    Para perder peso você precisa consumir em média <strong>${loseWeight} calorias</strong>.
                </li>
                <li>
                    Para ganhar peso você precisa consumir em média <strong>${gainWeight} calorias</strong>.
                </li>
            </ul>
        `
    }

}

document.querySelectorAll('input').forEach(input => input.addEventListener('keydown', () => cleanWarn(input.id)))

function throwExpectedInput(...ids) {
    const parentInputs = ids.map(id => document.getElementById(id)).map(input => input.parentNode)
    parentInputs.forEach(parentInput => parentInput.classList.add('error_input_value'))

    document.getElementById('output_info').style.visibility = 'visible'
}

function cleanWarns() {
    document.querySelectorAll('.error_input_value').forEach(input => input.classList.remove('error_input_value'))
    document.getElementById('output_info').style.visibility = 'hidden'
}

function cleanWarn(id) {
    document.getElementById(id).parentNode.classList.remove('error_input_value')

    if(document.querySelectorAll('.error_input_value').length === 0) {
        document.getElementById('output_info').style.visibility = 'hidden'
    }
}

function calcAll(gender, age, weight, height, activityLevel) {
    const tmb = Math.round(
        gender === 'masculine'
            ? 66 + (13.8 * weight) + (5 * height) - (6.8 * age)
            : 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age)
    )
    const maintence = Math.round(tmb * activityLevel)
    const loseWeight = maintence - 450
    const gainWeight = maintence + 450

    return { tmb, maintence, loseWeight, gainWeight }
}

function getValues() {    
    const gender = getSelectValue('gender')
    const activityLevel = getSelectValue('activity_level')
    
    const [age, weight, height, success] = verifyAndCheckNumberValues()

    return { gender, age, weight, height, activityLevel, success }
}

function verifyAndCheckNumberValues() {
    const expectedNumberValuesId = [ 'age', 'weight', 'height' ]
    const failedNumberValuesId = expectedNumberValuesId.filter(id => !getNumberValue(id))

    const failed = failedNumberValuesId.length > 0
    if(failed) {
        throwExpectedInput(...failedNumberValuesId)
    }

    return (
        failed
            ? [0, 0, 0, false]
            : [...expectedNumberValuesId.map(id => getNumberValue(id)), true]
    )

}

function getSelectValue(id) {
    const submit = document.getElementById(id)
    return submit.options[submit.selectedIndex].value
}

function getNumberValue(id) {
    const value = document.getElementById(id).value
    return !value ? NaN : Number(value)
}

function waitingLogoControl() {

    const waitingContent = document.querySelector('.waiting')
    const waitingLogo = document.getElementById('waiting-logo')

    let intervalCallbackId, scale = 0.2

    function show() {
        waitingContent.style.display = 'flex'
        intervalCallbackId = setInterval(handleAnimation, 1000); 
    }

    function handleAnimation() {
        waitingLogo.style.transform = `scale(${scale})`
        scale = scale === 0.2 ? 1 : 0.2
    }

    function hide() {
        waitingContent.style.display = 'none'
        clearInterval(intervalCallbackId)
    }

    return { show, hide }

}