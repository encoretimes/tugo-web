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
      <div className="feature-card h-full rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 hover-lift cursor-default">
        <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-blue-600 flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 sm:mb-3">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
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
      <div className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
        {count.toLocaleString()}
        <span className="text-blue-300">{suffix}</span>
      </div>
      <p className="text-blue-200/80 text-sm sm:text-base lg:text-lg">
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
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden">
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-sm border-b border-[var(--border-primary)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
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
            <nav className="hidden md:flex items-center gap-8">
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
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
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
      <div className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-1">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className="p-3 group"
            aria-label={`섹션 ${index + 1}로 이동`}
          >
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? 'bg-[var(--brand-primary)] scale-125'
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
        <div className="absolute inset-0 geo-pattern-subtle opacity-50" />

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-subtle" />

        {/* Noise Overlay */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-white/90 text-sm font-medium mb-6 sm:mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              차세대 정치 커뮤니티 플랫폼
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.15] mb-6 sm:mb-8 animate-fade-in-up">
              <span className="block">건강한 정치 토론의</span>
              <span className="block mt-1 sm:mt-2">
                새로운 공간,{' '}
                <span className="font-display italic text-blue-300">TUGO</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100/80 max-w-2xl leading-relaxed mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up-delayed">
              다양한 시각을 존중하는 열린 토론 플랫폼.
              <br className="hidden sm:block" />
              정치 크리에이터를 만나고, 여론의 흐름을 확인하세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up-delayed">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#1E3A5F] px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-blue-50 transition-all duration-300"
              >
                지금 시작하기
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                onClick={() => scrollToSection(1)}
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                자세히 알아보기
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator - hidden on mobile */}
        <button
          onClick={() => scrollToSection(1)}
          className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 hidden sm:flex group"
          aria-label="아래로 스크롤"
        >
          <span className="text-white/60 text-sm group-hover:text-white/80 transition-colors">
            스크롤
          </span>
          <ChevronDownIcon className="w-6 h-6 text-white/60 scroll-indicator group-hover:text-white/80 transition-colors" />
        </button>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent pointer-events-none" />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section
        ref={addSectionRef(1)}
        className="landing-section bg-gradient-to-br from-slate-900 via-[#1E3A5F] to-blue-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 geo-pattern-subtle" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <RevealSection className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              성장하는 커뮤니티
            </h2>
            <p className="text-blue-200/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              매일 더 많은 사람들이 TUGO에서 건강한 정치 토론에 참여하고 있습니다
            </p>
          </RevealSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
            <StatCounter value={10} suffix="K+" label="활성 사용자" />
            <StatCounter value={500} suffix="+" label="정치 크리에이터" />
            <StatCounter value={50} suffix="K+" label="투표 참여" />
            <StatCounter value={100} suffix="K+" label="게시물" />
          </div>

          {/* Trust Badges */}
          <RevealSection delay={0.3} className="mt-12 sm:mt-16 lg:mt-20">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 items-center">
              <div className="flex items-center gap-2 text-blue-200/70">
                <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">안전한 플랫폼</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200/70">
                <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">다양한 시각 존중</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200/70">
                <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm">건강한 토론 문화</span>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section
        ref={addSectionRef(2)}
        className="py-16 sm:py-24 lg:py-32 px-5 sm:px-6 bg-[var(--bg-primary)] relative"
      >
        <div className="max-w-7xl mx-auto">
          <RevealSection className="text-center mb-10 sm:mb-14 lg:mb-20">
            <span className="inline-block text-[var(--brand-primary)] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
              Platform Features
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">
              정치 토론의 새로운 기준
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              건강한 정치 토론을 위한 혁신적인 기능들을 경험하세요
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
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
        className="py-16 sm:py-24 lg:py-32 px-5 sm:px-6 bg-[var(--bg-secondary)] relative overflow-hidden"
      >
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--brand-primary)]/5 to-transparent hidden sm:block" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <RevealSection>
                <span className="inline-block text-[var(--brand-primary)] font-semibold text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
                  For Creators
                </span>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6">
                  정치 크리에이터로서
                  <br />
                  성장하세요
                </h2>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
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
                    <div className="flex gap-3 sm:gap-4 group">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[var(--brand-primary)]/10 flex items-center justify-center group-hover:bg-[var(--brand-primary)]/20 transition-colors">
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--brand-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] mb-0.5 sm:mb-1">
                          {item.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
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
                  className="inline-flex items-center gap-2 text-[var(--brand-primary)] font-semibold hover:gap-3 transition-all text-sm sm:text-base"
                >
                  크리에이터로 시작하기
                  <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </RevealSection>
            </div>

            {/* Right: Visual */}
            <RevealSection delay={0.2}>
              <div className="relative mt-8 lg:mt-0">
                {/* Mock Dashboard Card */}
                <div className="feature-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl">
                  <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
                    <div>
                      <p className="text-[var(--text-tertiary)] text-xs sm:text-sm">
                        이번 달 수익
                      </p>
                      <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                        ₩2,450,000
                      </p>
                    </div>
                    <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium">
                      +23%
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-5 sm:mb-6 lg:mb-8">
                    {[
                      { label: '구독자', value: '2,847' },
                      { label: '게시물', value: '156' },
                      { label: '조회수', value: '124K' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-[var(--bg-tertiary)]"
                      >
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--text-primary)]">
                          {stat.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[var(--text-tertiary)]">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="h-28 sm:h-32 lg:h-40 rounded-lg sm:rounded-xl bg-gradient-to-br from-[var(--brand-primary)]/10 to-blue-500/5 flex items-end justify-around p-3 sm:p-4">
                    {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                      <div
                        key={i}
                        className="w-5 sm:w-6 lg:w-8 rounded-t-md sm:rounded-t-lg bg-gradient-to-t from-[var(--brand-primary)] to-blue-400"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Elements - hidden on mobile to prevent overlap */}
                <div className="hidden md:block absolute -top-4 lg:-top-6 -right-2 lg:-right-6 feature-card rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg lg:shadow-xl animate-float">
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div>
                      <p className="text-xs lg:text-sm font-medium text-[var(--text-primary)]">
                        새 구독자
                      </p>
                      <p className="text-[10px] lg:text-xs text-[var(--text-tertiary)]">
                        방금 전
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="hidden md:flex absolute -bottom-2 lg:-bottom-4 -left-2 lg:-left-4 feature-card rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-lg lg:shadow-xl animate-float items-center gap-2"
                  style={{ animationDelay: '1s' }}
                >
                  <HeartIcon className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                  <span className="text-xs lg:text-sm font-medium text-[var(--text-primary)]">
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
        className="py-16 sm:py-24 lg:py-32 px-5 sm:px-6 bg-slate-900 relative overflow-hidden"
      >
        <div className="absolute inset-0 geo-pattern-subtle opacity-30" />

        <div className="max-w-7xl mx-auto relative z-10">
          <RevealSection className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
              안전하고 투명한 플랫폼
            </h2>
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
              TUGO는 건강한 정치 토론 문화를 위해 명확한 커뮤니티 가이드라인을
              운영합니다.
              <br className="hidden sm:block" />
              혐오 발언, 허위 정보 유포 등은 엄격히 제한됩니다.
            </p>
          </RevealSection>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                <div className="text-center p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-5 lg:mb-6">
                    <item.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
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
                  className="flex items-center gap-2 text-slate-300 text-sm sm:text-base"
                >
                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
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
        className="landing-section bg-[var(--bg-primary)] relative overflow-hidden"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 via-transparent to-blue-600/5" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">
          <RevealSection>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6 sm:mb-8 leading-tight">
              당신의 목소리가
              <br />
              <span className="text-gradient">세상을 바꿉니다</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto">
              TUGO에서 새로운 정치 토론을 경험하세요.
              <br />
              지금 바로 시작할 수 있습니다.
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 sm:gap-3 bg-[var(--brand-primary)] text-white px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 lg:py-5 rounded-full text-base sm:text-lg lg:text-xl font-semibold hover:bg-[var(--brand-hover)] transition-all duration-300 shadow-lg shadow-[var(--brand-primary)]/25 hover:shadow-xl hover:shadow-[var(--brand-primary)]/30"
            >
              TUGO 시작하기
              <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </RevealSection>

          <RevealSection delay={0.3} className="mt-6 sm:mt-8">
            <p className="text-[var(--text-tertiary)] text-xs sm:text-sm">
              가입은 무료입니다. 언제든지 시작하세요.
            </p>
          </RevealSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[var(--border-primary)] py-10 sm:py-12 lg:py-16 px-5 sm:px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <Image
                src="/logo.svg"
                alt="TUGO"
                width={100}
                height={32}
                className="mb-4"
              />
              <p className="text-[var(--text-secondary)] text-sm max-w-sm leading-relaxed">
                TUGO는 건강한 정치 토론을 위한 차세대 커뮤니티 플랫폼입니다.
                다양한 시각이 공존하는 열린 공간을 만들어갑니다.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">
                서비스
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    홈
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    탐색
                  </Link>
                </li>
                <li>
                  <Link
                    href="/explore/creators"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    크리에이터
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-4">
                정책
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--text-tertiary)] text-sm">
              &copy; 2025 TUGO. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm"
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
