"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import { MdQrCode2 } from "react-icons/md";
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  XMarkIcon,
  BellAlertIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import mkIcon from "@/public/logo/makbyteIcon.jpeg";
import noProfilePhotoURL from "@/public/images/noavatar.png";
import SwitchButton from "../ui/switchButton";
import Logo from "../ui/logo";
import { useUserContext } from "@/context/UserContext";
import { useTheme } from "@/context/themeContext";
import { GiTeacher } from "react-icons/gi";
import { CompanyName } from "@/defaults";
import { ChartPieIcon } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "Schools",
    href: "/dashboard/schools",
    icon: BuildingLibraryIcon,
    current: false,
  },
  {
    name: "Teachers",
    href: "/dashboard/teachers",
    icon: GiTeacher,
    current: false,
  },
  {
    name: "Parents",
    href: "/dashboard/parents",
    icon: UsersIcon,
    current: false,
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: UserGroupIcon,
    current: false,
  },

  {
    name: "Scanner",
    href: "/dashboard/scanner",
    icon: MdQrCode2,
    current: false,
  },
  {
    name: "Attendance",
    href: "/dashboard/attendance",
    icon: ChartPieIcon,
    current: false,
  },
  {
    name: "Fees",
    href: "/dashboard/fees",
    icon: CurrencyRupeeIcon,
    current: false,
  },
  {
    name: "Notifications",
    href: "/dashboard/notification",
    icon: BellAlertIcon,
    current: false,
  },
];

const handleClearStorage = (logOut) => {
  console.log("User logged out, localStorage data removed.");
  localStorage.clear();
  logOut();
};

const userNavigation = [
  { name: "Your profile", href: "/dashboard/profile" },
  { name: "Sign out", href: "/" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DashboardUi = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const { theme } = useTheme();
  const { user, isSuperAdmin, logOut } = useUserContext();
  const { displayName, email, photoURL } = user;

  const profileStatus = isSuperAdmin ? "Super Admin" : "School Admin";

  const altPlaceholder = isSuperAdmin
    ? CompanyName
    : displayName
    ? displayName
    : email;
  const srcPlaceholder = isSuperAdmin ? mkIcon : noProfilePhotoURL;

  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <>
      <div className={`${theme === "dark" ? "dark" : ""}`}>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/8 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="bg-[--text] relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 dark:text-white text-[--bg]"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto dark:bg-[--bg] px-6 pb-4 ring-1 ring-white/10 dark:ring-[--bg]">
                <div className="flex h-16 shrink-0 items-center">
                  <Logo position={"justify-start"} />
                  <div className="">
                    <SwitchButton />
                  </div>
                </div>

                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation?.map((item, index) => {
                          {
                            /* const hideItem =
                            !isSuperAdmin && item.name === "Schools"; */
                          }
                          return (
                            <li
                              key={item?.name}
                              // style={{
                              //   display: hideItem ? "none" : "block",
                              // }}
                            >
                              <Link
                                href={item?.href}
                                onClick={() => setSidebarOpen(false)}
                                className={classNames(
                                  pathname === item?.href
                                    ? "dark:bg-[--bgSoft] text-white bg-indigo-600"
                                    : "dark:text-gray-400 text-[--bg] hover:bg-gray-200 dark:hover:bg-[--bgSoft] dark:hover:text-white hover:text-black",
                                  "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                )}
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className="h-6 w-6 shrink-0"
                                />
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      <Link
                        href="/dashboard/settings"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-gray-800 dark:text-white text-[--bg]"
                      >
                        <Cog6ToothIcon
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0"
                        />
                        Settings
                      </Link>
                    </li>
                    <li className="dark:text-[--text] text-[--bg] tracking-wide font-thin">
                      Powered by{" "}
                      <a
                        href="https://makbyte.io/"
                        target="blank"
                        className="text-indigo-600 cursor-pointer font-medium"
                      >
                        {CompanyName}
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r-2 border-gray-200 dark:border-none">
          <div className="flex grow flex-col gap-y-3 dark:bg-[--bg] bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center gap-2">
              <Logo position={"justify-start"} />

              <div className="mr-[-12px]">
                <SwitchButton />
              </div>
            </div>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item, index) => {
                      {
                        /* const hideItem = !isSuperAdmin && item.name === "Schools"; */
                      }

                      return (
                        <li
                          key={item?.name}
                          // style={{
                          //   display: hideItem ? "none" : "block",
                          // }}
                        >
                          <Link
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? "dark:bg-[--bgSoft] text-white bg-indigo-600"
                                : "dark:text-gray-400 text-[--bg] hover:bg-gray-200 dark:hover:bg-[--bgSoft] dark:hover:text-white hover:text-black",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="h-6 w-6 shrink-0"
                            />
                            {item?.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li className="mt-auto ">
                  <Link
                    href="/dashboard/settings"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 dark:text-gray-400 hover:text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    <Cog6ToothIcon
                      aria-hidden="true"
                      className="h-6 w-6 shrink-0"
                    />
                    Settings
                  </Link>
                </li>
                <li className="dark:text-white text-[--bg] tracking-wide font-semibold">
                  Powered by{" "}
                  <a
                    href="https://makbyte.io/"
                    target="blank"
                    className="text-indigo-600 cursor-pointer font-medium"
                  >
                    {CompanyName}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72 ">
          <div className="dark:bg-[--bg] dark:border-none sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 bg-[--text] dark:bg-[--bg]">
              <form
                action="#"
                method="GET"
                className="relative flex flex-1 dark:py-2"
              >
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-2 h-full w-5 dark:text-[--text]"
                />
                <input
                  id="search-field"
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="pl-10 effect-1 focus:outline-none w-full border-b-2 border-transparent focus:border-transparent dark:bg-[--bgSoft] dark:text-[--text] dark:rounded-xl pr-2"
                />
                <span className="focus-border absolute bottom-0 left-0 h-[2px] bg-blue-600 dark:bg-[--text] transition-all duration-400 w-0"></span>
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {photoURL ? (
                      <>
                        <img
                          src={photoURL}
                          alt={altPlaceholder}
                          width={"32px"}
                          height={"32px"}
                          className="h-8 w-8 rounded-full bg-gray-50"
                        />
                      </>
                    ) : (
                      <>
                        <Image
                          alt={altPlaceholder}
                          src={srcPlaceholder}
                          className="h-8 w-8 rounded-full bg-gray-50"
                        />
                      </>
                    )}
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-[--bg] dark:text-[--text]"
                      >
                        {displayName ? displayName : email}
                        <br />
                        <span className="text-[10px]">{profileStatus}</span>
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {userNavigation.map((item) => (
                      <MenuItem key={item?.name}>
                        <Link
                          href={item?.href}
                          onClick={() => {
                            return (
                              item?.name === "Sign out" &&
                              handleClearStorage(logOut)
                            );
                          }}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50"
                        >
                          {item?.name}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="min-h-screen py-6 dark:bg-[--bgSoft]">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardUi;
