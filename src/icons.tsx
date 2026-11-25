import type { CSSProperties } from 'react';
import {
  Add,
  ArrowDown as SaxArrowDown,
  ArrowDown2,
  ArrowLeft as SaxArrowLeft,
  ArrowRight as SaxArrowRight,
  ArrowRight2,
  Book1,
  Card,
  Chart2,
  Cpu,
  Global,
  HambergerMenu,
  Instagram as SaxInstagram,
  Layer,
  Link21,
  MagicStar,
  MessageCircle as SaxMessageCircle,
  Messages,
  MessageTick,
  Mobile,
  More,
  People,
  Play as SaxPlay,
  Send2,
  Setting2,
  Setting4,
  ShieldTick,
  Sound,
  TickCircle,
  Whatsapp as SaxWhatsapp,
  TaskSquare,
  ShoppingBag as SaxShoppingBag,
  Microphone2,
  Timer1,
  Receipt2,
  TrendUp as SaxTrendUp,
  UserTick,
  Truck as SaxTruck,
  Shop,
} from 'iconsax-react';
import type { Icon, IconProps } from 'iconsax-react';

export type { IconProps } from 'iconsax-react';

// Keep the website's semantic names while rendering genuine Iconsax SVGs.
// Linear uses the collection's native 1.5px stroke, including nested paths.
function iconsax(Component: Icon, name: string, rotation?: CSSProperties['rotate']): Icon {
  function SiteIcon({ size = 24, color = 'currentColor', variant = 'Linear', strokeWidth: _strokeWidth, style, ...props }: IconProps) {
    return <Component
      size={size}
      color={color}
      variant={variant}
      focusable="false"
      aria-hidden={props['aria-label'] ? undefined : true}
      style={rotation ? { rotate: rotation, ...style } : style}
      {...props}
    />;
  }
  SiteIcon.displayName = `Iconsax${name}`;
  return SiteIcon;
}

export const ArrowDown = iconsax(SaxArrowDown, 'ArrowDown');
export const ArrowLeft = iconsax(SaxArrowLeft, 'ArrowLeft');
export const ArrowRight = iconsax(SaxArrowRight, 'ArrowRight');
export const ArrowUpRight = iconsax(SaxArrowRight, 'ArrowUpRight', '-45deg');
export const AudioLines = iconsax(Sound, 'Sound');
export const BarChart3 = iconsax(Chart2, 'Chart2');
export const Bot = iconsax(Cpu, 'Cpu');
export const Check = iconsax(TickCircle, 'TickCircle');
export const CheckCheck = iconsax(MessageTick, 'MessageTick');
export const ChevronDown = iconsax(ArrowDown2, 'ArrowDown2');
export const ChevronRight = iconsax(ArrowRight2, 'ArrowRight2');
export const CreditCard = iconsax(Card, 'Card');
export const Globe2 = iconsax(Global, 'Global');
export const Instagram = iconsax(SaxInstagram, 'Instagram');
export const Layers3 = iconsax(Layer, 'Layer');
export const Menu = iconsax(HambergerMenu, 'HambergerMenu');
export const MessageCircle = iconsax(SaxMessageCircle, 'MessageCircle');
export const MessagesSquare = iconsax(Messages, 'Messages');
export const MoreHorizontal = iconsax(More, 'More');
export const Play = iconsax(SaxPlay, 'Play');
export const Plug = iconsax(Link21, 'Link21');
export const Plus = iconsax(Add, 'Add');
export const Send = iconsax(Send2, 'Send2');
export const ShieldCheck = iconsax(ShieldTick, 'ShieldTick');
export const Smartphone = iconsax(Mobile, 'Mobile');
export const Sparkles = iconsax(MagicStar, 'MagicStar');
export const Users = iconsax(People, 'People');
export const X = iconsax(Add, 'Close', '45deg');
export const WhatsApp = iconsax(SaxWhatsapp, 'Whatsapp');
export const Setting = iconsax(Setting2, 'Setting2');
export const Customize = iconsax(Setting4, 'Setting4');
export const Book = iconsax(Book1, 'Book1');
export const ListCheck = iconsax(TaskSquare, 'TaskSquare');
export const ShoppingBag = iconsax(SaxShoppingBag, 'ShoppingBag');
export const Mic = iconsax(Microphone2, 'Microphone2');
export const Timer = iconsax(Timer1, 'Timer1');
export const Receipt = iconsax(Receipt2, 'Receipt2');
export const TrendUp = iconsax(SaxTrendUp, 'TrendUp');
export const UserCheck = iconsax(UserTick, 'UserTick');
export const Truck = iconsax(SaxTruck, 'Truck');
export const Store = iconsax(Shop, 'Shop');

// LinkedIn is absent from the Iconsax free collection. This is the official
// LinkedIn [in] silhouette, extracted without its favicon notification badge:
// https://static.licdn.com/aero-v1/sc/h/5bukxbhy9xsil5mb7c2wulfbx
export function Linkedin({ size = 24, color = 'currentColor', variant: _variant, strokeWidth: _strokeWidth, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden={props['aria-label'] ? undefined : true} {...props}>
    <path fill={color} d="M55.92 4H8.08C6.99792 4 5.96015 4.42986 5.195 5.195C4.42986 5.96015 4 6.99792 4 8.08V55.92C4 57.0021 4.42986 58.0398 5.195 58.805C5.96015 59.5701 6.99792 60 8.08 60H55.92C57.0021 60 58.0398 59.5701 58.805 58.805C59.5701 58.0398 60 57.0021 60 55.92V8.08C60 6.99792 59.5701 5.96015 58.805 5.195C58.0398 4.42986 57.0021 4 55.92 4V4ZM20 52H12V25H20V52ZM16 20.7C14.7535 20.7 13.558 20.2048 12.6766 19.3234C11.7952 18.442 11.3 17.2465 11.3 16C11.3 14.7535 11.7952 13.558 12.6766 12.6766C13.558 11.7952 14.7535 11.3 16 11.3V11.3C17.2465 11.3 18.442 11.7952 19.3234 12.6766C20.2048 13.558 20.7 14.7535 20.7 16C20.7 17.2465 20.2048 18.442 19.3234 19.3234C18.442 20.2048 17.2465 20.7 16 20.7ZM52 52H44V37.81C44 33.5 41.27 31.7 39 31.7C38.1867 31.673 37.3769 31.8168 36.6226 32.1221C35.8684 32.4275 35.1866 32.8876 34.6212 33.4728C34.0558 34.058 33.6194 34.7552 33.3401 35.5195C33.0609 36.2838 32.945 37.0982 33 37.91V52H25V25H32.53V28.79H32.64C33.44 27.15 37.08 24.42 41.77 24.42C46.46 24.42 52 27.59 52 35.76V52Z" />
  </svg>;
}
