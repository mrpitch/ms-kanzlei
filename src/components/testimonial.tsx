import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/cn"


import configJson from '@/lib/config.json';
import { TConfig } from '@/lib/types';

// Color variants for the main wrapper
const testimonialColorVariants = cva("", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground",
			secondary: "bg-secondary text-secondary-foreground",
			outline: "bg-transparent border border-border text-foreground",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
})

// Size variants for the main wrapper padding
const testimonialSizeVariants = cva("", {
	variants: {
		size: {
			small: "pb-10 sm:pb-14 xl:pb-0",
			large: "pb-20 sm:pb-24 xl:pb-0",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

// Size variants for the outer wrapper
const testimonialOuterSizeVariants = cva("py-16 md:py-24 lg:py-32", {
	variants: {
		size: {
			small: "pt-14 sm:pt-18 xl:pb-18",
			large: "pt-24 sm:pt-32 xl:pb-32",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

// Size variants for the container
const testimonialContainerSizeVariants = cva(
	"mx-auto flex flex-col items-center px-6 lg:px-8 xl:flex-row xl:items-stretch",
	{
		variants: {
			size: {
				small: "max-w-5xl gap-x-6 gap-y-8 sm:gap-y-6",
				large: "max-w-7xl gap-x-8 gap-y-10 sm:gap-y-8",
			},
		},
		defaultVariants: {
			size: "small",
		},
	}
)

// Size variants for the image wrapper
const testimonialImageWrapperSizeVariants = cva("w-full xl:flex-none", {
	variants: {
		size: {
			small: "-mt-7 max-w-md xl:-mb-7 xl:w-72",
			large: "-mt-8 max-w-2xl xl:-mb-8 xl:w-96",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

// Size variants for the image aspect ratio
const testimonialImageAspectSizeVariants = cva(
	"relative h-full after:absolute after:inset-0 after:rounded-2xl after:inset-ring after:inset-ring-white/15 md:-mx-8 xl:mx-0 xl:aspect-auto",
	{
		variants: {
			size: {
				small: "aspect-3/2",
				large: "aspect-2/1",
			},
		},
		defaultVariants: {
			size: "small",
		},
	}
)

// Size variants for the content area
const testimonialContentSizeVariants = cva(
	"w-full max-w-2xl xl:max-w-none xl:flex-auto",
	{
		variants: {
			size: {
				small: "xl:px-12 xl:py-14",
				large: "xl:px-16 xl:py-24",
			},
		},
		defaultVariants: {
			size: "small",
		},
	}
)

// Size variants for the figure
const testimonialFigureSizeVariants = cva("relative isolate", {
	variants: {
		size: {
			small: "pt-4 sm:pt-8",
			large: "pt-6 sm:pt-12",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

// Text variants with both color and size
const testimonialTextVariants = cva("font-semibold", {
	variants: {
		variant: {
			primary: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			outline: "text-foreground",
		},
		size: {
			small: "text-base/7 sm:text-lg/8",
			large: "text-xl/8 sm:text-2xl/9",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "small",
	},
})

// Muted text variants (color only)
const testimonialMutedTextVariants = cva("mt-1", {
	variants: {
		variant: {
			primary: "text-primary-foreground/60",
			secondary: "text-secondary-foreground/60",
			outline: "text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
})

// Quote icon variants with both color and size
const testimonialQuoteVariants = cva("absolute top-0 left-0 -z-10", {
	variants: {
		variant: {
			primary: "stroke-primary-foreground/20",
			secondary: "stroke-secondary-foreground/20",
			outline: "stroke-foreground/20",
		},
		size: {
			small: "h-20",
			large: "h-32",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "small",
	},
})

// Figcaption size variants
const testimonialFigcaptionSizeVariants = cva("", {
	variants: {
		size: {
			small: "mt-6 text-sm",
			large: "mt-8 text-base",
		},
	},
	defaultVariants: {
		size: "small",
	},
})

const config: TConfig = configJson as TConfig;
const testimonial = config.testimonials[0];

interface TestimonialProps
	extends VariantProps<typeof testimonialColorVariants>,
	VariantProps<typeof testimonialSizeVariants> {
	className?: string
}

export default function Testimonial({ variant, size, className }: TestimonialProps) {
	return (
		<div className={testimonialOuterSizeVariants({ size })}>
			<div className={cn(testimonialColorVariants({ variant }), testimonialSizeVariants({ size }), className)}>
				<div className="container mx-auto px-6 lg:px-20">
					<div className={testimonialContainerSizeVariants({ size })}>
						<div className={testimonialImageWrapperSizeVariants({ size })}>
							<div className={testimonialImageAspectSizeVariants({ size })}>
								<img
									alt={testimonial.name}
									src={testimonial.image}
									className="absolute inset-0 size-full rounded-2xl bg-muted object-cover shadow-2xl"
								/>
							</div>
						</div>
						<div className={testimonialContentSizeVariants({ size })}>
							<figure className={testimonialFigureSizeVariants({ size })}>
								<svg
									fill="none"
									viewBox="0 0 162 128"
									aria-hidden="true"
									className={testimonialQuoteVariants({ variant, size })}
								>
									<path
										d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
										id="b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb"
									/>
									<use x={86} href="#b56e9dab-6ccb-4d32-ad02-6b4bb5d9bbeb" />
								</svg>
								<blockquote className={testimonialTextVariants({ variant, size })}>
									<p>
										{testimonial.text}
									</p>
								</blockquote>
								<figcaption className={testimonialFigcaptionSizeVariants({ size })}>
									<div className={testimonialTextVariants({ variant, size })}>{testimonial.name}</div>
									<div className={testimonialMutedTextVariants({ variant })}>{testimonial.title}</div>
								</figcaption>
							</figure>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export { testimonialColorVariants, testimonialSizeVariants, type TestimonialProps }
