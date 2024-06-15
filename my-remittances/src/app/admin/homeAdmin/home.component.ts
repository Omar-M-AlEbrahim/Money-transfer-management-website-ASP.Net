import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ChartOptions, ChartType, ChartDataset, Color } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ITransfir, Idate, TransfirService } from '../transfer/transfir.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { subDays, format, parseISO } from 'date-fns';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    BaseChartDirective // تأكد من استيراد NgChartsModule بشكل صحيح هنا
    ,NgxChartsModule,
    MatTableModule,
    MatInputModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  data$: ITransfir[] = []; // مصفوفة لتخزين بيانات التحويلات
  data: Idate[]; // مصفوفة لتخزين البيانات المعالجة
  single: { name: string, value: number }[]; // مصفوفة لتخزين بيانات المخطط البياني
  displayedColumns: string[] = ['amount', 'status',  'senderName', 'receiverName']; // أعمدة الجدول

  gradient: boolean = false; // خاصية لتحديد إذا ما كان المخطط يحتوي على تدرجات لونية
  showLegend: boolean = false; // خاصية لتحديد إذا ما كان المخطط يحتوي على أسطورة
  showXAxis: boolean = true; // خاصية لتحديد إذا ما كان المخطط يظهر المحور السيني
  showYAxis: boolean = true; // خاصية لتحديد إذا ما كان المخطط يظهر المحور الصادي
  showXAxisLabel: boolean = true; // خاصية لتحديد إذا ما كان المخطط يظهر تسمية المحور السيني
  showYAxisLabel: boolean = true; // خاصية لتحديد إذا ما كان المخطط يظهر تسمية المحور الصادي

  constructor(private transferService: TransfirService) {}

  ngOnInit(): void {
    // الاشتراك في خدمة التحويلات لجلب البيانات وتحديثها
    this.transferService.transferes$.subscribe(data => {
      this.data$ = data;
    });

    // جلب عدد التحويلات لكل يوم في الأسبوع الماضي
    this.transferService.getTransferCountPerDayLastWeek().subscribe((data: Idate[]) => {
      this.data = this.fillMissingDates(data); // معالجة البيانات لتشمل الأيام السبعة الماضية
      this.updateChartData(); // تحديث بيانات المخطط البياني
    });
  }

  // دالة لمعالجة البيانات وملء التواريخ المفقودة
  fillMissingDates(data: Idate[]): Idate[] {
    // إنشاء مصفوفة تحتوي على الأيام السبعة الماضية
    const lastSevenDays = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      const formattedDate = format(date, 'yyyy-MM-dd');
      return {
        date: formattedDate,
        count: 0
      };
    }).reverse();

    // تحديث الأيام السبعة الماضية بالبيانات الموجودة
    lastSevenDays.forEach(day => {
      const found = data.find(item => format(parseISO(item.date), 'yyyy-MM-dd') === day.date);
      if (found) {
        day.count = found.count;
      }
    });

    return lastSevenDays;
  }

  // دالة لتحديث بيانات المخطط البياني
  updateChartData(): void {
    this.single = this.data.map(item => ({
      name: item.date,
      value: item.count
    }));
  }

  // دالة لمعالجة حدث اختيار عنصر في المخطط البياني
  onSelect(event) {
    console.log(event);
  }
}
