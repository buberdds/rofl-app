import { type FC } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@oasisprotocol/ui-library/src/components/ui/dialog'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { Spinner } from '../../Spinner'

interface ProgressStep {
  id: number
  label: string
  description: string
}

interface TopUpProgressDialogProps {
  isOpen: boolean
  currentStep: number | null
  stepStatuses: {
    [key: number]: 'pending' | 'processing' | 'completed' | 'error'
  }
  progressSteps: ProgressStep[]
  onClose: () => void
}

export const TopUpProgressDialog: FC<TopUpProgressDialogProps> = ({
  isOpen,
  currentStep,
  stepStatuses,
  progressSteps,
  onClose,
}) => {
  // Determine if we should show the close button
  const allStepsCompleted = progressSteps.every(step => stepStatuses[step.id] === 'completed')
  const hasError = Object.values(stepStatuses).some(status => status === 'error')
  const showCloseButton = allStepsCompleted || hasError
  const isProcessing = currentStep !== null && !showCloseButton

  return (
    <Dialog open={isOpen} onOpenChange={showCloseButton ? onClose : undefined}>
      <DialogContent className={`sm:max-w-md ${!showCloseButton ? '[&>button]:hidden' : ''}`}>
        <DialogHeader>
          <DialogTitle>
            {isProcessing
              ? 'Top up Progress'
              : allStepsCompleted
                ? 'Top up Complete'
                : hasError
                  ? 'Top up Failed'
                  : 'Top up Progress'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {progressSteps.map(step => {
            const status = stepStatuses[step.id] || 'pending'
            const isActive = currentStep === step.id
            const isCompleted = status === 'completed'
            const isError = status === 'error'
            const isProcessing = status === 'processing'

            return (
              <div key={step.id} className="flex items-start gap-3">
                <div
                  className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isError
                        ? 'bg-error text-white'
                        : isProcessing
                          ? 'bg-foreground text-white'
                          : 'bg-muted border-2 border-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    '✓'
                  ) : isError ? (
                    '✗'
                  ) : isProcessing ? (
                    <Spinner className="w-3 h-3 text-muted" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isCompleted
                        ? 'text-success'
                        : isError
                          ? 'text-error'
                          : isActive
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                  {isCompleted && <p className="text-xs text-success mt-1">Complete</p>}
                  {isError && <p className="text-xs text-error mt-1">Error occurred</p>}
                </div>
              </div>
            )
          })}
        </div>

        {showCloseButton && (
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
