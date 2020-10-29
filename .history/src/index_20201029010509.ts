import { BehaviorSubject, from, fromEvent } from 'rxjs'
import { map, tap, filter, find, switchMap } from 'rxjs/operators'

type DOMEvent<T = Element> = Event & {
  currentTarget: T
  target: Element
}

const allSteps = document.querySelectorAll<HTMLElement>('#stepper .step')
const allForms = document.querySelectorAll<HTMLFormElement>('#stepper form')

const allSteps$ = from(allSteps)

const currentStep$ = new BehaviorSubject(0)

const submitForm$ = fromEvent<DOMEvent<HTMLFormElement>>(allForms, 'submit')
  .pipe(
    tap(e => e.preventDefault())
  )

const nextStep$ = submitForm$
  .pipe(
    map(e => {
      const currentStep = Number(e.currentTarget.getAttribute('data-step'))
      const activeIndexStep = currentStep < allSteps.length - 1 ? currentStep + 1 : currentStep
      return activeIndexStep
    }),
  )

const hiddenSteps$ = currentStep$.pipe(
  switchMap(currentStep =>
    allSteps$.pipe(
      filter(element => +element.getAttribute('data-step') !== currentStep),
    )
  ),
)

const visibleSteps$ = currentStep$.pipe(
  switchMap(currentStep => {
    debugger;
    return allSteps$.pipe(
      find(element => +element.getAttribute('data-step') === currentStep),
    )
  }),
)

hiddenSteps$.subscribe((stepElement) => {
  console.log('hiddenSteps', stepElement)
  stepElement.hidden = true
})

visibleSteps$.subscribe((stepElement) => {
  console.log('visibleSteps', stepElement)
  stepElement.hidden = false
})

nextStep$.subscribe(currentStep$)
