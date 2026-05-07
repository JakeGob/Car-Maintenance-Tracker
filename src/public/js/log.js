const form = document.forms[0];
form.noValidate = true; 

function setFieldError(el, msg){
    const wrapper = el.closest('.field');
    if(!wrapper) return;
    const msgEl = wrapper.querySelector('.error-message');
    if(msg){
        wrapper.classList.add('invalid');
        msgEl.textContent = msg;
    } else {
        wrapper.classList.remove('invalid');
        msgEl.textContent = '';
    }
}

// clear error on input
form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('input', () => setFieldError(input, ''));
});

form.onsubmit = async function(event){
    event.preventDefault();

    let hasError = false;
    const requiredFields = [
        {el: form.car_model, msg: 'Enter car name/model.'},
        {el: form.service_type, msg: 'Select a service.'},
        {el: form.mileage, msg: 'Enter mileage.'},
        {el: form.service_date, msg: 'Provide date of service.'},
        {el: form.cost, msg: 'Enter cost (0 if none).'}
    ];

    requiredFields.forEach(f => {
        if(!f.el || !String(f.el.value).trim()){
            setFieldError(f.el, f.msg);
            hasError = true;
        } else {
            setFieldError(f.el, '');
        }
    });

    if(hasError){
        return;
    }

    const body = {
        car_model: form.car_model.value,
        service_date: form.service_date.value,
        service_type: form.service_type.value,
        mileage: form.mileage.value,
        cost: parseFloat(form.cost.value) || 0,
        notes: form.notes.value
    }

    fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(body),
        headers:{
            'Content-Type':'application/json'
        }
    }).then((res) => {
        if(!res.ok){
            throw new Error("Failed to log service.");
        }
        return res.json();
    }).then((data) => {
        window.location.href = '../history.html'
    }).catch((err) => {
        alert(err.message);
    }).finally(() => {
        form.reset();
        // clear visual errors
        form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));
    });
}

