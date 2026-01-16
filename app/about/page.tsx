'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  BoltIcon,
  GlobeAltIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

// Hook for scroll-triggered reveal animations
function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isRevealed };
}

// Animated counter hook
function useAnimatedCounter(
  target: number,
  duration: number = 2000,
  startOnReveal: boolean = true
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const { ref, isRevealed } = useRevealOnScroll(0.5);

  useEffect(() => {
    if (!startOnReveal || !isRevealed || hasStarted) return;
    setHasStarted(true);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(animate);
  }, [isRevealed, target, duration, startOnReveal, hasStarted]);

  return { count, ref };
}

// Section component with reveal animation
function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isRevealed } = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={`reveal-element ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const { ref, isRevealed } = useRevealOnScroll();

  return (
    <div
      ref={ref}
      className={`reveal-scale ${isRevealed ? 'revealed' : ''} group`}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="feature-card hover-lift h-full cursor-default rounded-xl p-5 sm:rounded-2xl sm:p-6 lg:p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand-primary)] to-blue-600 transition-transform duration-300 group-hover:scale-105 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-xl lg:mb-6 lg:h-14 lg:w-14">
          <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-[var(--text-primary)] sm:mb-3 sm:text-xl">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

// Stat counter component
function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { count, ref } = useAnimatedCounter(value);

  return (
    <div ref={ref} className="text-center">
      <div className="mb-2 font-display text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {count.toLocaleString()}
        <span className="text-blue-300">{suffix}</span>
      </div>
      <p className="text-sm text-blue-200/80 sm:text-base lg:text-lg">
        {label}
      </p>
    </div>
  );
}

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<HTMLElement[]>([]);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section for nav indicator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionsRef.current.indexOf(
              entry.target as HTMLElement
            );
            if (index !== -1) setActiveSection(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const addSectionRef = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      if (el) sectionsRef.current[index] = el;
    },
    []
  );

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-primary)]">
      {/* Fixed Header */}
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/90 border-b border-[var(--border-primary)] shadow-sm backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="TUGO"
                width={100}
                height={32}
                className="text-[var(--text-primary)]"
                style={{
                  filter: isScrolled
                    ? 'var(--logo-filter, none)'
                    : 'brightness(0) invert(1)',
                }}
              />
            </Link>

            {/* Nav Links - Desktop */}
            <nav className="hidden items-center gap-8 md:flex">
              <button
                onClick={() => scrollToSection(1)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                서비스 소개
              </button>
              <button
                onClick={() => scrollToSection(2)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                주요 기능
              </button>
              <button
                onClick={() => scrollToSection(3)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                크리에이터
              </button>
            </nav>

            {/* CTA Button */}
            <Link
              href="/login"
              className={`rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'bg-[var(--brand-primary)] text-white hover:opacity-90'
                  : 'bg-white text-[#1E3A5F] hover:bg-white/90'
              }`}
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* Section Navigation Dots - with proper touch targets */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 lg:right-8 lg:flex">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="group p-3"
            aria-label={`섹션 ${index + 1}로 이동`}
          >
            <span
              className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'scale-125 bg-[var(--brand-primary)]'
                  : 'bg-[var(--text-tertiary)]/30 group-hover:bg-[var(--text-tertiary)]'
              }`}
            />
          </button>
        ))}
      </div>

      {/* ===== HERO SECTION ===== */}
      <section
        ref={addSectionRef(0)}
        className="landing-section hero-gradient relative overflow-hidden"
      >
        {/* Geometric Background Pattern */}
        <div className="geo-pattern-subtle absolute inset-0 opacity-50" />

        {/* Gradient Orbs */}
        <div className="absolute -left-32 top-1/4 h-96 w-96 animate-pulse-subtle rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-32 bottom-1/4 h-80 w-80 animate-pulse-subtle rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Noise Overlay */}
        <div className="noise-overlay absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 md:py-32 lg:px-8">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="glass mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/90 sm:mb-8">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              차세대 정치 커뮤니티 플랫폼
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 animate-fade-in-up text-4xl font-bold leading-[1.15] text-white sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block">건강한 정치 토론의</span>
              <span className="mt-1 block sm:mt-2">
                새로운 공간,{' '}
                <span className="font-display italic text-blue-300">TUGO</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-2xl animate-fade-in-up-delayed text-lg leading-relaxed text-blue-100/80 sm:mb-10 sm:text-xl lg:mb-12 lg:text-2xl">
              다양한 시각을 존중하는 열린 토론 플랫폼.
              <br className="hidden sm:block" />
              정치 크리에이터를 만나고, 여론의 흐름을 확인하세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex animate-fade-in-up-delayed flex-col gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-[#1E3A5F] transition-all duration-300 hover:bg-blue-50 sm:px-8 sm:py-4 sm:text-lg"
              >
                지금 시작하기
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => scrollToSection(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-white/10 sm:px-8 sm:py-4 sm:text-lg"
              >
                자세히 알아보기
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <button
          onClick={() => scrollToSection(1)}
          className="group absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:bottom-12 sm:flex"
          aria-label="아래로 스크롤"
        >
          <span className="text-sm text-white/60 transition-colors group-hover:text-white/80">
            스크롤
          </span>
          <ChevronDownIcon className="scroll-indicator h-6 w-6 text-white/60 transition-colors group-hover:text-white/80" />
        </button>

        {/* Bottom Gradient Fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-primary)] to-transparent sm:h-32" />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section
        ref={addSectionRef(1)}
        className="landing-section relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1E3A5F] to-blue-900"
      >
        <div className="geo-pattern-subtle absolute inset-0" />

        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <RevealSection className="mb-12 text-center sm:mb-16 lg:mb-20">
            <h2 className="mb-4 font-display text-3xl font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl">
              성장하는 커뮤니티
            </h2>
            <p className="mx-auto max-w-2xl text-base text-blue-200/70 sm:text-lg lg:text-xl">
              매일 더 많은 사람들이 TUGO에서 건강한 정치 토론에 참여하고
              있습니다
            </p>
          </RevealSection>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 lg:gap-12">
            <StatCounter value={10} suffix="K+" label="활성 사용자" />
            <StatCounter value={500} suffix="+" label="정치 크리에이터" />
            <StatCounter value={50} suffix="K+" label="투표 참여" />
            <StatCounter value={100} suffix="K+" label="게시물" />
          </div>

          {/* Trust Badges */}
          <RevealSection delay={0.3} className="mt-12 sm:mt-16 lg:mt-20">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              <div className="flex items-center gap-2 text-blue-200/70">
                <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">안전한 플랫폼</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200/70">
                <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">다양한 시각 존중</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200/70">
                <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">건강한 토론 문화</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        ref={addSectionRef(2)}
        className="relative bg-[var(--bg-primary)] px-5 py-16 sm:px-6 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <RevealSection className="mb-10 text-center sm:mb-14 lg:mb-20">
            <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)] sm:mb-4 sm:text-sm">
              Platform Features
            </span>
            <h2 className="mb-4 font-display text-3xl font-bold text-[var(--text-primary)] sm:mb-6 sm:text-4xl md:text-5xl">
              정치 토론의 새로운 기준
            </h2>
            <p className="mx-auto max-w-2xl text-base text-[var(--text-secondary)] sm:text-lg lg:text-xl">
              건강한 정치 토론을 위한 혁신적인 기능들을 경험하세요
            </p>
          </RevealSection>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              title="열린 토론 공간"
              description="좌도 우도 아닌, 다양한 시각이 공존하는 공간. 서로 다른 의견을 존중하며 건설적인 토론을 나눕니다."
              delay={0}
            />
            <FeatureCard
              icon={ChartBarIcon}
              title="실시간 투표"
              description="다양한 이슈에 대한 투표에 참여하고, 실시간으로 여론의 흐름을 확인할 수 있습니다."
              delay={0.1}
            />
            <FeatureCard
              icon={ShieldCheckIcon}
              title="신뢰할 수 있는 환경"
              description="명확한 커뮤니티 가이드라인과 투명한 운영으로 건전한 토론 문화를 만들어갑니다."
              delay={0.2}
            />
            <FeatureCard
              icon={BoltIcon}
              title="빠른 피드 업데이트"
              description="관심 있는 주제와 크리에이터의 새로운 콘텐츠를 실시간으로 확인하세요."
              delay={0.3}
            />
            <FeatureCard
              icon={UserGroupIcon}
              title="커뮤니티 기반"
              description="같은 관심사를 가진 사람들과 깊이 있는 대화를 나누고 네트워크를 확장하세요."
              delay={0.4}
            />
            <FeatureCard
              icon={SparklesIcon}
              title="맞춤형 추천"
              description="당신의 관심사에 맞는 콘텐츠와 크리에이터를 스마트하게 추천해드립니다."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ===== CREATOR SECTION ===== */}
      <section
        ref={addSectionRef(3)}
        className="relative overflow-hidden bg-[var(--bg-secondary)] px-5 py-16 sm:px-6 sm:py-24 lg:py-32"
      >
        {/* Background accent */}
        <div className="from-[var(--brand-primary)]/5 absolute right-0 top-0 hidden h-full w-1/2 bg-gradient-to-l to-transparent sm:block" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Left: Content */}
            <div>
              <RevealSection>
                <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-wider text-[var(--brand-primary)] sm:mb-4 sm:text-sm">
                  For Creators
                </span>
                <h2 className="mb-4 font-display text-3xl font-bold text-[var(--text-primary)] sm:mb-6 sm:text-4xl md:text-5xl">
                  정치 크리에이터로서
                  <br />
                  성장하세요
                </h2>
                <p className="mb-8 text-base leading-relaxed text-[var(--text-secondary)] sm:mb-10 sm:text-lg">
                  TUGO는 정치 크리에이터들이 자신의 목소리를 내고, 구독자와
                  소통하며, 지속 가능한 활동을 할 수 있는 완벽한 플랫폼입니다.
                </p>
              </RevealSection>

              {/* Feature List */}
              <div className="space-y-4 sm:space-y-6">
                {[
                  {
                    icon: UserGroupIcon,
                    title: '구독자 관리',
                    desc: '구독자와 직접 소통하고, 구독자 전용 콘텐츠로 충성도 높은 팬층을 구축하세요.',
                  },
                  {
                    icon: CurrencyDollarIcon,
                    title: '수익 창출',
                    desc: '구독료와 후원을 통해 지속 가능한 콘텐츠 활동을 이어갈 수 있습니다.',
                  },
                  {
                    icon: ChartBarIcon,
                    title: '인사이트 분석',
                    desc: '게시물 분석, 구독자 인사이트 등 크리에이터를 위한 다양한 도구를 제공합니다.',
                  },
                ].map((item, index) => (
                  <RevealSection key={item.title} delay={0.1 * (index + 1)}>
                    <div className="group flex gap-3 sm:gap-4">
                      <div className="bg-[var(--brand-primary)]/10 group-hover:bg-[var(--brand-primary)]/20 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors sm:h-12 sm:w-12 sm:rounded-xl">
                        <item.icon className="h-5 w-5 text-[var(--brand-primary)] sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="mb-0.5 text-base font-semibold text-[var(--text-primary)] sm:mb-1 sm:text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>

              <RevealSection delay={0.4} className="mt-8 sm:mt-10">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] transition-all hover:gap-3 sm:text-base"
                >
                  크리에이터로 시작하기
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </RevealSection>
            </div>

            {/* Right: Visual */}
            <RevealSection delay={0.2}>
              <div className="relative mt-8 lg:mt-0">
                {/* Mock Dashboard Card */}
                <div className="feature-card rounded-2xl p-5 shadow-xl sm:rounded-3xl sm:p-6 sm:shadow-2xl lg:p-8">
                  <div className="mb-5 flex items-center justify-between sm:mb-6 lg:mb-8">
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)] sm:text-sm">
                        이번 달 수익
                      </p>
                      <p className="font-display text-2xl font-bold text-[var(--text-primary)] sm:text-3xl lg:text-4xl">
                        ₩2,450,000
                      </p>
                    </div>
                    <div className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:px-3 sm:py-1.5 sm:text-sm">
                      +23%
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-3 lg:mb-8 lg:gap-4">
                    {[
                      { label: '구독자', value: '2,847' },
                      { label: '게시물', value: '156' },
                      { label: '조회수', value: '124K' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg bg-[var(--bg-tertiary)] p-2.5 text-center sm:rounded-xl sm:p-3 lg:p-4"
                      >
                        <p className="text-lg font-bold text-[var(--text-primary)] sm:text-xl lg:text-2xl">
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-[var(--text-tertiary)] sm:text-xs">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="from-[var(--brand-primary)]/10 flex h-28 items-end justify-around rounded-lg bg-gradient-to-br to-blue-500/5 p-3 sm:h-32 sm:rounded-xl sm:p-4 lg:h-40">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <div
                        key={i}
                        className="w-5 rounded-t-md bg-gradient-to-t from-[var(--brand-primary)] to-blue-400 sm:w-6 sm:rounded-t-lg lg:w-8"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Elements - hidden on mobile to prevent overlap */}
                <div className="feature-card absolute -right-2 -top-4 hidden animate-float rounded-xl p-3 shadow-lg md:block lg:-right-6 lg:-top-6 lg:rounded-2xl lg:p-4 lg:shadow-xl">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 lg:h-10 lg:w-10" />
                    <div>
                      <p className="text-xs font-medium text-[var(--text-primary)] lg:text-sm">
                        새 구독자
                      </p>
                      <p className="text-[10px] text-[var(--text-tertiary)] lg:text-xs">
                        방금 전
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="feature-card absolute -bottom-2 -left-2 hidden animate-float items-center gap-2 rounded-xl p-3 shadow-lg md:flex lg:-bottom-4 lg:-left-4 lg:rounded-2xl lg:p-4 lg:shadow-xl"
                  style={{ animationDelay: '1s' }}
                >
                  <HeartIcon className="h-4 w-4 text-red-500 lg:h-5 lg:w-5" />
                  <span className="text-xs font-medium text-[var(--text-primary)] lg:text-sm">
                    +127 좋아요
                  </span>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ===== TRUST SECTION ===== */}
      <section
        ref={addSectionRef(4)}
        className="relative overflow-hidden bg-slate-900 px-5 py-16 sm:px-6 sm:py-24 lg:py-32"
      >
        <div className="geo-pattern-subtle absolute inset-0 opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <RevealSection className="mb-10 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-4 font-display text-3xl font-bold text-white sm:mb-6 sm:text-4xl md:text-5xl">
              안전하고 투명한 플랫폼
            </h2>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg lg:text-xl">
              TUGO는 건강한 정치 토론 문화를 위해 명확한 커뮤니티 가이드라인을
              운영합니다.
              <br className="hidden sm:block" />
              혐오 발언, 허위 정보 유포 등은 엄격히 제한됩니다.
            </p>
          </RevealSection>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: '24시간 모니터링',
                desc: '전문 모니터링 팀이 24시간 커뮤니티를 관리합니다.',
              },
              {
                icon: GlobeAltIcon,
                title: '투명한 운영 정책',
                desc: '모든 운영 정책과 기준을 투명하게 공개합니다.',
              },
              {
                icon: BoltIcon,
                title: '신속한 신고 처리',
                desc: '문제 신고 시 빠르고 공정하게 처리합니다.',
              },
            ].map((item, index) => (
              <RevealSection key={item.title} delay={0.1 * (index + 1)}>
                <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center transition-colors hover:bg-white/10 sm:rounded-2xl sm:p-6 lg:p-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 sm:mb-5 sm:h-14 sm:w-14 sm:rounded-2xl lg:mb-6 lg:h-16 lg:w-16">
                    <item.icon className="h-6 w-6 text-blue-400 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white sm:mb-3 sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Commitment List */}
          <RevealSection delay={0.4} className="mt-10 sm:mt-12 lg:mt-16">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                '개인정보 보호',
                '공정한 운영',
                '다양성 존중',
                '투명한 정책',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-300 sm:text-base"
                >
                  <CheckCircleIcon className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        ref={addSectionRef(5)}
        className="landing-section relative overflow-hidden bg-[var(--bg-primary)]"
      >
        {/* Background gradient */}
        <div className="from-[var(--brand-primary)]/5 absolute inset-0 bg-gradient-to-br via-transparent to-blue-600/5" />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-6">
          <RevealSection>
            <h2 className="mb-6 font-display text-3xl font-bold leading-tight text-[var(--text-primary)] sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl">
              당신의 목소리가
              <br />
              <span className="text-gradient">세상을 바꿉니다</span>
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-base text-[var(--text-secondary)] sm:mb-10 sm:text-lg md:text-xl lg:mb-12 lg:text-2xl">
              TUGO에서 새로운 정치 토론을 경험하세요.
              <br />
              지금 바로 시작할 수 있습니다.
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <Link
              href="/login"
              className="shadow-[var(--brand-primary)]/25 hover:shadow-[var(--brand-primary)]/30 group inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[var(--brand-hover)] hover:shadow-xl sm:gap-3 sm:px-8 sm:py-4 sm:text-lg lg:px-10 lg:py-5 lg:text-xl"
            >
              TUGO 시작하기
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1 sm:h-6 sm:w-6" />
            </Link>
          </RevealSection>

          <RevealSection delay={0.3} className="mt-6 sm:mt-8">
            <p className="text-xs text-[var(--text-tertiary)] sm:text-sm">
              가입은 무료입니다. 언제든지 시작하세요.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] px-5 py-10 sm:px-6 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 sm:mb-10 sm:grid-cols-2 sm:gap-10 md:grid-cols-4 lg:mb-12 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <Image
                src="/logo.svg"
                alt="TUGO"
                width={100}
                height={32}
                className="mb-4"
              />
              <p className="max-w-sm text-sm leading-relaxed text-[var(--text-secondary)]">
                TUGO는 건강한 정치 토론을 위한 차세대 커뮤니티 플랫폼입니다.
                다양한 시각이 공존하는 열린 공간을 만들어갑니다.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="mb-4 font-semibold text-[var(--text-primary)]">
                서비스
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    탐색
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore/creators"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    크리에이터
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-4 font-semibold text-[var(--text-primary)]">
                정책
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--border-primary)] pt-8 md:flex-row">
            <p className="text-sm text-[var(--text-tertiary)]">
              &copy; 2025 TUGO. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-primary)]"
              >
                고객센터
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
