import { BehaviorSubject, from, fromEvent, merge } from 'rxjs'
import { map, tap, filter, find, findIndex, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLFormElement>('.stepper-item')
const allForms = document.querySelectorAll<HTMLFormElement>('.stepper-item form')

const allSteps$ = from(allSteps)

const activeIndexStep$ = new BehaviorSubject(0)

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const nextIndexStep$ = submitForm$
  .pipe(
    switchMap(event => 
      allSteps$.pipe(
        findIndex(step => event.currentTarget.closest('.stepper-item') === step)
      )
    ),
    map(stepIndex => stepIndex < allSteps.length - 1 ? stepIndex + 1 : stepIndex )
  )

const hiddenSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      filter((element, index) => index !== activeIndexStep),
    )
  ),
)

const visibleSteps$ = activeIndexStep$.pipe(
  switchMap(activeIndexStep =>
    allSteps$.pipe(
      find((element, index) => index === activeIndexStep),
    )
  ),
)

hiddenSteps$.subscribe((element) => {
  console.log('hiddenSteps', element.firstElementChild.textContent)
  element.classList.remove('active')
})

visibleSteps$.subscribe((element) => {
  console.log('visibleSteps', element.firstElementChild.textContent)
  element.classList.add('active')
})

nextIndexStep$.subscribe(activeIndexStep$)

activeIndexStep$.subscribe((activeIndexStep) => {
  console.log('activeIndexStep', activeIndexStep)
})
