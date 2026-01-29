import {
	AlertTriangle,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	BicepsFlexed,
	Bold,
	Book,
	BookOpen,
	Calendar,
	CalendarCheck,
	ChevronDown,
	ChevronRight,
	ChevronsUpDown,
	Check,
	CheckCircle2,
	Circle,
	Clipboard,
	Code,
	Cookie,
	Copy,
	Database,
	Download,
	Dumbbell,
	Edit,
	Eye,
	Fingerprint,
	FolderKanban,
	GripVertical,
	Heading3,
	Heading4,
	House,
	ImageIcon,
	ImagePlus,
	Info,
	Italic,
	LayoutDashboard,
	List,
	ListOrdered,
	Loader2,
	LogIn,
	LogOut,
	Mail,
	Monitor,
	MonitorX,
	Moon,
	Menu,
	MoreHorizontal,
	Phone,
	Play,
	Plus,
	PlusCircle,
	Rocket,
	Save,
	Search,
	Settings,
	Shield,
	Smartphone,
	SunMedium,
	Tag,
	TextAlignStart,
	Trash2,
	Upload,
	User,
	UserCog,
	X,
	XCircle,
	Zap,
} from 'lucide-react'

export type IconType =
	| 'alertTriangle'
	| 'arrowDown'
	| 'arrowLeft'
	| 'arrowRight'
	| 'arrowUp'
	| 'bicepsFlexed'
	| 'bold'
	| 'book'
	| 'bookOpen'
	| 'calendar'
	| 'calendarCheck'
	| 'check'
	| 'checkCircle'
	| 'chevronsUpDown'
	| 'chevronDown'
	| 'chevronRight'
	| 'circle'
	| 'clipboard'
	| 'code'
	| 'database'
	| 'cookie'
	| 'copy'
	| 'download'
	| 'dumbbell'
	| 'edit'
	| 'eye'
	| 'fingerprint'
	| 'folderKanban'
	| 'gripVertical'
	| 'heading3'
	| 'heading4'
	| 'house'
	| 'image'
	| 'imagePlus'
	| 'info'
	| 'italic'
	| 'layoutDashboard'
	| 'list'
	| 'listOrdered'
	| 'loader'
	| 'logIn'
	| 'logOut'
	| 'mail'
	| 'menu'
	| 'monitor'
	| 'monitorX'
	| 'moon'
	| 'moreHorizontal'
	| 'play'
	| 'plus'
	| 'plusCircle'
	| 'phone'
	| 'rocket'
	| 'save'
	| 'search'
	| 'settings'
	| 'shield'
	| 'smartphone'
	| 'sun'
	| 'tag'
	| 'textAlignStart'
	| 'trash'
	| 'upload'
	| 'user'
	| 'userRole'
	| 'x'
	| 'xCircle'
	| 'zap'

// IconProps extends SVG attributes to allow passing all standard SVG props to icons
export type IconProps = React.SVGProps<SVGSVGElement>

const Icons = {
	alertTriangle: (props: IconProps) => <AlertTriangle {...props} />,
	arrowDown: (props: IconProps) => <ArrowDown {...props} />,
	arrowLeft: (props: IconProps) => <ArrowLeft {...props} />,
	arrowRight: (props: IconProps) => <ArrowRight {...props} />,
	arrowUp: (props: IconProps) => <ArrowUp {...props} />,
	bicepsFlexed: (props: IconProps) => <BicepsFlexed {...props} />,
	bold: (props: IconProps) => <Bold {...props} />,
	book: (props: IconProps) => <Book {...props} />,
	bookOpen: (props: IconProps) => <BookOpen {...props} />,
	calendar: (props: IconProps) => <Calendar {...props} />,
	calendarCheck: (props: IconProps) => <CalendarCheck {...props} />,
	check: (props: IconProps) => <Check {...props} />,
	checkCircle: (props: IconProps) => <CheckCircle2 {...props} />,
	chevronsUpDown: (props: IconProps) => <ChevronsUpDown {...props} />,
	chevronDown: (props: IconProps) => <ChevronDown {...props} />,
	chevronRight: (props: IconProps) => <ChevronRight {...props} />,
	circle: (props: IconProps) => <Circle {...props} />,
	clipboard: (props: IconProps) => <Clipboard {...props} />,
	code: (props: IconProps) => <Code {...props} />,
	cookie: (props: IconProps) => <Cookie {...props} />,
	copy: (props: IconProps) => <Copy {...props} />,
	database: (props: IconProps) => <Database {...props} />,
	download: (props: IconProps) => <Download {...props} />,
	dumbbell: (props: IconProps) => <Dumbbell {...props} />,
	edit: (props: IconProps) => <Edit {...props} />,
	eye: (props: IconProps) => <Eye {...props} />,
	fingerprint: (props: IconProps) => <Fingerprint {...props} />,
	folderKanban: (props: IconProps) => <FolderKanban {...props} />,
	gripVertical: (props: IconProps) => <GripVertical {...props} />,
	heading3: (props: IconProps) => <Heading3 {...props} />,
	heading4: (props: IconProps) => <Heading4 {...props} />,
	house: (props: IconProps) => <House {...props} />,
	image: (props: IconProps) => <ImageIcon {...props} />,
	imagePlus: (props: IconProps) => <ImagePlus {...props} />,
	info: (props: IconProps) => <Info {...props} />,
	italic: (props: IconProps) => <Italic {...props} />,
	layoutDashboard: (props: IconProps) => <LayoutDashboard {...props} />,
	list: (props: IconProps) => <List {...props} />,
	listOrdered: (props: IconProps) => <ListOrdered {...props} />,
	loader: (props: IconProps) => <Loader2 {...props} />,
	logIn: (props: IconProps) => <LogIn {...props} />,
	logOut: (props: IconProps) => <LogOut {...props} />,
	mail: (props: IconProps) => <Mail {...props} />,
	monitor: (props: IconProps) => <Monitor {...props} />,
	monitorX: (props: IconProps) => <MonitorX {...props} />,
	moon: (props: IconProps) => <Moon {...props} />,
	moreHorizontal: (props: IconProps) => <MoreHorizontal {...props} />,
	phone: (props: IconProps) => <Phone {...props} />,
	play: (props: IconProps) => <Play {...props} />,
	plus: (props: IconProps) => <Plus {...props} />,
	plusCircle: (props: IconProps) => <PlusCircle {...props} />,
	rocket: (props: IconProps) => <Rocket {...props} />,
	save: (props: IconProps) => <Save {...props} />,
	search: (props: IconProps) => <Search {...props} />,
	settings: (props: IconProps) => <Settings {...props} />,
	shield: (props: IconProps) => <Shield {...props} />,
	smartphone: (props: IconProps) => <Smartphone {...props} />,
	sun: (props: IconProps) => <SunMedium {...props} />,
	tag: (props: IconProps) => <Tag {...props} />,
	textAlignStart: (props: IconProps) => <TextAlignStart {...props} />,
	trash: (props: IconProps) => <Trash2 {...props} />,
	menu: (props: IconProps) => <Menu {...props} />,
	upload: (props: IconProps) => <Upload {...props} />,
	user: (props: IconProps) => <User {...props} />,
	userRole: (props: IconProps) => <UserCog {...props} />,
	x: (props: IconProps) => <X {...props} />,
	xCircle: (props: IconProps) => <XCircle {...props} />,
	zap: (props: IconProps) => <Zap {...props} />,
}

interface DynamicIconProps extends IconProps {
	iconName: keyof typeof Icons | IconType
}

export const Icon: React.FC<DynamicIconProps> = ({ iconName, ...props }) => {
	const IconComponent = Icons[iconName]
	if (!IconComponent) {
		return null // or return a default icon
	}
	return <IconComponent {...props} />
}
