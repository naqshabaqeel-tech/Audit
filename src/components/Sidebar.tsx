import filesIcon from '../assets/icons/files.svg'
import mapPinIcon from '../assets/icons/map-pin.svg'
import megaphoneIcon from '../assets/icons/megaphone.svg'
import sealPercentIcon from '../assets/icons/seal-percent.svg'
import sidebarToggleIcon from '../assets/icons/sidebar-toggle.svg'
import squaresFourIcon from '../assets/icons/squares-four.svg'
import storefrontIcon from '../assets/icons/storefront.svg'
import usersThreeIcon from '../assets/icons/users-three.svg'

const navItems = [
  { label: 'Dashboard', icon: squaresFourIcon },
  { label: 'Locations', icon: mapPinIcon },
  { label: 'Orders', icon: filesIcon },
  { label: 'Promotions', icon: megaphoneIcon },
  { label: 'Programs', icon: sealPercentIcon },
  { label: 'People', icon: usersThreeIcon },
  { label: 'Vendors', icon: storefrontIcon },
]

type SidebarProps = {
  activeItem?: string
}

export function Sidebar({ activeItem = 'Locations' }: SidebarProps) {
  return (
    <aside className="flex h-full w-[58px] shrink-0 flex-col gap-[30px] bg-background py-5 pr-2 pl-3">
      <button
        type="button"
        aria-label="Toggle sidebar"
        className="flex h-[30px] w-full cursor-pointer items-center justify-center px-1.5"
      >
        <img src={sidebarToggleIcon} alt="" width={28} height={28} />
      </button>
      <nav className="flex w-full flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            aria-label={item.label}
            title={item.label}
            aria-current={item.label === activeItem ? 'page' : undefined}
            className={`flex h-9 items-center rounded-lg px-2.5 ${
              item.label === activeItem ? 'bg-primary-50' : 'hover:bg-gray-100'
            }`}
          >
            <img src={item.icon} alt="" width={18} height={18} />
          </a>
        ))}
      </nav>
    </aside>
  )
}
