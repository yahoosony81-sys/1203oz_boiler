/**
 * @file components/footer.tsx
 * @description 공통 Footer 컴포넌트
 */

import Link from "next/link";
import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Car className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold text-white">TripCarShare</span>
            </div>
            <p className="text-sm text-gray-400">
              제주 공항에서 시작하는 스마트한 차량 공유 서비스.
              여행객과 차주를 연결합니다.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-white font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/vehicles" className="hover:text-white transition">
                  차량 검색
                </Link>
              </li>
              <li>
                <Link href="/vehicles/new" className="hover:text-white transition">
                  차량 등록
                </Link>
              </li>
              <li>
                <Link href="/bookings/my" className="hover:text-white transition">
                  예약 관리
                </Link>
              </li>
            </ul>
          </div>

          {/* 안내 */}
          <div>
            <h3 className="text-white font-semibold mb-4">안내</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/guide/owner" className="hover:text-white transition">
                  차주 가이드
                </Link>
              </li>
              <li>
                <Link href="/guide/renter" className="hover:text-white transition">
                  이용자 가이드
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-white font-semibold mb-4">고객센터</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1588-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@tripcarshare.kr</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>제주특별자치도 제주시</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-4">
              평일 09:00 - 18:00 (공휴일 제외)
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} TripCarShare. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>사업자등록번호: 000-00-00000</span>
              <span>대표: 홍길동</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

