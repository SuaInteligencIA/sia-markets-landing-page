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

// Brilhos (ícone "sparkles" do Lucide, https://lucide.dev, ISC), com a estrela grande preenchida.
export function Sparks({ size = 20, ...props }: { size?: number } & Omit<IconProps, 'size'>) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden={props['aria-label'] ? undefined : true} {...props}>
    <path fill="currentColor" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
  </svg>;
}

// WhatsApp preenchido (glifo do Simple Icons, https://simpleicons.org, CC0), para o canal em destaque.
export function WhatsAppFilled({ size = 18, color = 'currentColor', ...props }: { size?: number; color?: string } & Omit<IconProps, 'size' | 'color'>) {
  return <svg width={size} height={size} viewBox="0 0 24 24" focusable="false" aria-hidden={props['aria-label'] ? undefined : true} {...props}>
    <path fill={color} d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>;
}
