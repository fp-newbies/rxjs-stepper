import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'

const stepperEl = document.querySelector('#stepper') as HTMLElement
const stepsEl = stepperEl.querySelectorAll<HTMLElement>('.step')
const formsEl = stepperEl.querySelectorAll<HTMLElement>('form')
const nextButtonsEl = stepperEl.querySelectorAll<HTMLElement>('button')

const submitForm$ = fromEvent(formsEl, 'submit')
    .pipe(
        map(e => {
            e.preventDefault()
            return e;
        })
    )

