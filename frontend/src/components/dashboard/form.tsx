import { cn } from '@/lib/utils'
import { ChangeEvent, ComponentProps, Dispatch, SetStateAction } from 'react'
import { ImgSuspense } from '../img-fallback'
import { Skeleton } from '../skeleton'
import { LuImageOff } from 'react-icons/lu'

export function FormField({
  children,
  className,
  hidden,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-4 items-center has-[img]:items-start [&>label]:has-[img]:mt-2.5 [&>input]:col-span-3 [&>select]:col-span-3 [&>img]:col-start-2 [&>img]:col-end-5 [&>p]:col-start-2 [&>p]:col-end-5 [&>p]:text-left [&>p]:-mt-3 [&>button[role="combobox"]]:col-start-2 [&>button[role="combobox"]]:col-end-5 gap-4 text-right',
        { hidden },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function FormFieldsGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 py-4">{children}</div>
}

export function ImageForm({ src, className, ...props }: ComponentProps<'img'>) {
  return (
    src && (
      <ImgSuspense
        src={src}
        className={cn(
          'w-max object-cover rounded col-start-2 col-end-5',
          className,
        )}
        loadingFallback={
          <Skeleton
            className={cn('w-max rounded col-start-2 col-end-5', className)}
          />
        }
        errorFallback={
          <div
            className={cn(
              'w-max rounded bg-muted flex justify-center items-center col-start-2 col-end-5',
              className,
            )}
          >
            <LuImageOff className="text-muted-foreground" />
          </div>
        }
        {...props}
      />
    )
  )
}

export const handleImageChange = (
  event: ChangeEvent<HTMLInputElement>,
  setUpdateImage: Dispatch<SetStateAction<string | undefined>>,
) => {
  const file = event.target.files && event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setUpdateImage(result)
    }
    reader.readAsDataURL(file)
  }
}
