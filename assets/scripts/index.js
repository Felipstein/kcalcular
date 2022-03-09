const waitingLogo = waitingLogoControl()
waitingLogo.show()

document.getElementById('form').addEventListener('submit', handleSubmit)

function handleSubmit(event) {
    event.preventDefault()
    
    const gender = getSelectValue('gender')
    const age = getNumberValue('age')
    const weight = getNumberValue('weight')
    const height = getNumberValue('height')
    const activityLevel = getSelectValue('activity_level')

    const { tmb, maintence, loseWeight, gainWeight } = calcAll(gender, age, weight, height, Number(activityLevel))

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

function getSelectValue(id) {
    const submit = document.getElementById(id)
    return submit.options[submit.selectedIndex].value
}

function getNumberValue(id) {
    return Number(document.getElementById(id).value)
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